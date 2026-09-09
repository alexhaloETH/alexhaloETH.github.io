import { useEffect, useState } from 'react';
import { SLOTS } from '../useWardrobeData';

const EMPTY = { slot: 'tee', label: '', hex: '#708238', isActive: true };

function ItemFormModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(item ? { ...item } : EMPTY);
    setError('');
  }, [item]);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.label.trim()) { setError('Give it a name'); return; }
    if (!/^#?[0-9a-fA-F]{6}$/.test(form.hex.trim())) { setError('Hex must be 6 digits, like #708238'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wardrobe-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="wardrobe-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item ? 'Edit garment' : 'Add garment'}
        onClick={(event) => event.stopPropagation()}
      >
        <h3>{item ? 'Edit garment' : 'Add garment'}</h3>
        <form onSubmit={submit} className="wardrobe-form">
          <label className="wardrobe-field">
            <span>Slot</span>
            <select value={form.slot} onChange={set('slot')}>
              {SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
            </select>
          </label>

          <label className="wardrobe-field">
            <span>Label</span>
            <input value={form.label} onChange={set('label')} placeholder="olive tee" />
          </label>

          <label className="wardrobe-field">
            <span>Colour</span>
            <span className="wardrobe-hex-row">
              {/* Hex is the source of truth; hue, lightness and chroma are
                  derived server-side at write time so they cannot drift. */}
              <input type="color" value={form.hex.startsWith('#') ? form.hex : `#${form.hex}`} onChange={set('hex')} />
              <input className="wardrobe-hex-text" value={form.hex} onChange={set('hex')} spellCheck="false" />
            </span>
          </label>

          <label className="wardrobe-field wardrobe-field-inline">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
            <span>In rotation</span>
          </label>

          {error && <p className="wardrobe-error">{error}</p>}

          <div className="wardrobe-modal-actions">
            <button type="button" onClick={onClose} className="wardrobe-btn">Cancel</button>
            <button type="submit" className="wardrobe-btn primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemFormModal;
