import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import useAutoRotate from './hooks/useAutoRotate';
import useDisplayAlerts from './hooks/useDisplayAlerts';
import usePiDisplayData from './hooks/usePiDisplayData';
import AlertsPanel from './panels/AlertsPanel';
import DailyOpsPanel from './panels/DailyOpsPanel';
import GardenPanel from './panels/GardenPanel';
import GymPanel from './panels/GymPanel';
import LibraryPanel from './panels/LibraryPanel';
import NowPanel from './panels/NowPanel';
import SystemPanel from './panels/SystemPanel';
import {
  formatClock,
  formatDisplayDate,
  formatTemperature,
  PANEL_IDS,
  PANEL_LABELS,
} from './piDisplayUtils';
import './PiDisplay.css';

const panelVariants = {
  enter: { opacity: 0, y: 16, filter: 'blur(8px)' },
  center: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(8px)' },
};

const getQueryConfig = () => {
  const params = new URLSearchParams(window.location.search);
  const lockedPanel = params.get('panel');
  const fastMode = params.get('fast') === '1';

  return {
    fastMode,
    lockedPanel: [...PANEL_IDS, 'alerts'].includes(lockedPanel) ? lockedPanel : null,
  };
};

const renderPanel = (panelId, props) => {
  switch (panelId) {
    case 'alerts':
      return <AlertsPanel {...props} />;
    case 'garden':
      return <GardenPanel {...props} />;
    case 'daily':
      return <DailyOpsPanel {...props} />;
    case 'library':
      return <LibraryPanel {...props} />;
    case 'system':
      return <SystemPanel {...props} />;
    case 'gym':
      return <GymPanel {...props} />;
    case 'now':
    default:
      return <NowPanel {...props} />;
  }
};

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return now;
}

function StatusDot({ status = 'neutral', label }) {
  return (
    <span className={`pi-status-dot ${status}`}>
      <span />
      {label}
    </span>
  );
}

function PiHeader({ clock, data, alertCount }) {
  const apiStatus = data.health.apiOk ? 'ok' : 'critical';
  const tempStatus = typeof data.system.temperature === 'number' && data.system.temperature >= 70
    ? 'critical'
    : 'ok';

  return (
    <header className="pi-display-header">
      <div>
        <strong>{formatClock(clock)}</strong>
        <span>{formatDisplayDate(clock)}</span>
      </div>
      <div className="pi-display-status">
        <StatusDot status={apiStatus} label={data.health.apiOk ? 'API' : 'API'} />
        <StatusDot status={tempStatus} label={formatTemperature(data.system.temperature)} />
        {alertCount > 0 && <StatusDot status="warning" label={`${alertCount} alert${alertCount === 1 ? '' : 's'}`} />}
      </div>
    </header>
  );
}

function PiFooter({
  activePanelId,
  data,
  fastMode,
  isLoading,
  isPaused,
}) {
  const updatedAt = data.lastUpdated
    ? formatClock(new Date(data.lastUpdated))
    : 'waiting';

  return (
    <footer className="pi-display-footer">
      <span>{PANEL_LABELS[activePanelId] || 'Display'}</span>
      <span>
        {isLoading ? 'refreshing' : `updated ${updatedAt}`}
        {fastMode ? ' · fast' : ''}
        {isPaused ? ' · paused' : ''}
      </span>
    </footer>
  );
}

function PiDisplay() {
  const { authToken } = useAuth();
  const clock = useClock();
  const { fastMode, lockedPanel } = useMemo(() => getQueryConfig(), []);
  const refreshMs = fastMode ? 15000 : 60000;
  const rotateMs = fastMode ? 10000 : 300000;
  const { data, isLoading } = usePiDisplayData({ authToken, refreshMs });
  const alerts = useDisplayAlerts(data);
  const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical');
  const warningAlerts = alerts.filter((alert) => alert.severity !== 'info');
  const forcedAlertPanel = criticalAlerts.length > 0 || lockedPanel === 'alerts';

  const {
    activePanelId: rotatingPanelId,
    isPaused,
  } = useAutoRotate(PANEL_IDS, {
    enabled: !forcedAlertPanel,
    intervalMs: rotateMs,
    lockedPanelId: lockedPanel === 'alerts' ? null : lockedPanel,
  });

  const activePanelId = forcedAlertPanel ? 'alerts' : rotatingPanelId;
  const panelProps = {
    alerts,
    data,
    isLoading,
  };

  return (
    <main className={`pi-display ${forcedAlertPanel ? 'pi-display-alerting' : ''}`}>
      <div className="pi-display-grid-bg" />
      <PiHeader
        clock={clock}
        data={data}
        alertCount={warningAlerts.length}
      />

      <section className="pi-display-stage" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanelId}
            className="pi-panel-motion"
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderPanel(activePanelId, panelProps)}
          </motion.div>
        </AnimatePresence>
      </section>

      {!forcedAlertPanel && warningAlerts.length > 0 && (
        <div className={`pi-alert-strip ${warningAlerts[0].severity}`}>
          <strong>{warningAlerts[0].title}</strong>
          <span>{warningAlerts[0].message}</span>
        </div>
      )}

      <PiFooter
        activePanelId={activePanelId}
        data={data}
        fastMode={fastMode}
        isLoading={isLoading}
        isPaused={isPaused}
      />
    </main>
  );
}

export default PiDisplay;
