import { useMemo } from 'react';

const getTemperatureSeverity = (temperature) => {
  if (typeof temperature !== 'number') {
    return null;
  }

  if (temperature >= 75) {
    return 'critical';
  }

  if (temperature >= 65) {
    return 'warning';
  }

  return null;
};

function useDisplayAlerts(data) {
  return useMemo(() => {
    const alerts = [];

    if (!data.health.apiOk) {
      alerts.push({
        id: 'api-down',
        severity: 'critical',
        title: 'API offline',
        message: 'Backend health check is unavailable.',
        detail: data.health.error || 'Check the backend service or Cloudflare tunnel.',
        source: 'System',
      });
    }

    if (data.authMissing) {
      alerts.push({
        id: 'auth-missing',
        severity: 'critical',
        title: 'Display token missing',
        message: 'Private dashboard data cannot load.',
        detail: 'Log into the dashboard once on this browser so the Pi display can reuse the token.',
        source: 'Auth',
      });
    }

    if (data.system.error && !data.authMissing) {
      alerts.push({
        id: 'system-unavailable',
        severity: 'warning',
        title: 'System stats unavailable',
        message: 'The Pi status endpoint did not respond.',
        detail: data.system.error,
        source: 'System',
      });
    }

    const temperatureSeverity = getTemperatureSeverity(data.system.temperature);
    if (temperatureSeverity) {
      alerts.push({
        id: 'pi-temperature',
        severity: temperatureSeverity,
        title: temperatureSeverity === 'critical' ? 'Pi temperature high' : 'Pi warming up',
        message: `${Math.round(data.system.temperature)}°C`,
        detail: temperatureSeverity === 'critical'
          ? 'Check airflow around the case.'
          : 'Keep an eye on the case temperature.',
        source: 'System',
      });
    }

    if (typeof data.system.diskUsage === 'number' && data.system.diskUsage >= 90) {
      alerts.push({
        id: 'disk-critical',
        severity: 'critical',
        title: 'Disk almost full',
        message: `${Math.round(data.system.diskUsage)}% used`,
        detail: 'Free disk space before services start failing.',
        source: 'System',
      });
    } else if (typeof data.system.diskUsage === 'number' && data.system.diskUsage >= 80) {
      alerts.push({
        id: 'disk-warning',
        severity: 'warning',
        title: 'Disk usage high',
        message: `${Math.round(data.system.diskUsage)}% used`,
        detail: 'Plan a cleanup soon.',
        source: 'System',
      });
    }

    if (data.garden.overduePlants.length > 0) {
      const first = data.garden.overduePlants[0];
      alerts.push({
        id: 'plants-overdue',
        severity: 'warning',
        title: 'Watering overdue',
        message: `${data.garden.overduePlants.length} plant${data.garden.overduePlants.length === 1 ? '' : 's'} need water`,
        detail: `${first.name} is ${Math.abs(first.daysUntilWater)}d overdue.`,
        source: 'Garden',
      });
    }

    if (data.daily.highPriorityTask) {
      alerts.push({
        id: 'high-priority-task',
        severity: 'info',
        title: 'High priority task',
        message: data.daily.highPriorityTask.text,
        detail: data.daily.highPriorityTask.dueDate,
        source: 'Tasks',
      });
    }

    const currentHour = new Date().getHours();
    if (
      currentHour >= 20
      && data.library.dailyGoal
      && data.library.pagesToday < data.library.dailyGoal
    ) {
      alerts.push({
        id: 'reading-goal',
        severity: 'info',
        title: 'Reading goal left',
        message: `${data.library.pagesToday}/${data.library.dailyGoal} pages`,
        detail: `${data.library.dailyGoal - data.library.pagesToday} pages left today.`,
        source: 'Library',
      });
    }

    const severityOrder = {
      critical: 0,
      warning: 1,
      info: 2,
    };

    return alerts.sort((left, right) => (
      severityOrder[left.severity] - severityOrder[right.severity]
    ));
  }, [data]);
}

export default useDisplayAlerts;
