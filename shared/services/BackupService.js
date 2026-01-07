/**
 * @typedef {Object} BackupMeta
 * @property {string} version - Extension version
 * @property {string} exportedAt - ISO Date string
 * @property {number} schemaVersion - Internal schema version
 * @property {string} [checksum] - SHA-256 integrity hash
 */

/**
 * @typedef {Object} BackupPayload
 * @property {BackupMeta} meta
 * @property {Object} data - Raw storage dump
 */

/**
 * Service responsible for exporting and importing user data.
 * Adheres to Infrastructure Service pattern.
 */
export class BackupService {
  /**
   * Exports all local storage data to a JSON file.
   * @returns {Promise<void>}
   */
  static async exportData() {
    const data = await chrome.storage.local.get(null);
    const { version } = chrome.runtime.getManifest();

    /** @type {BackupPayload} */
    const payload = {
      meta: {
        version,
        exportedAt: new Date(Date.now()).toISOString(),
        schemaVersion: 1,
      },
      data,
    };

    // Generate Checksum (Integrity)
    // We hash the canonical string representation of 'data' to ensure consistency
    payload.meta.checksum = await BackupService._generateChecksum(payload.data);

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `univesp-backup-${new Date().toISOString().slice(0, 10)}.json`;

    await new Promise((resolve) => {
      chrome.downloads.download(
        {
          url: url,
          filename: filename,
          saveAs: true,
        },
        () => resolve()
      );
    });
  }

  /**
   * Imports data from a JSON string, validting schema and version.
   * @param {string} jsonString
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async importData(jsonString) {
    try {
      let payload;
      try {
        payload = JSON.parse(jsonString);
      } catch {
        return { success: false, error: 'JSON incompleto ou inválido.' };
      }

      // Schema Validation
      if (!payload.meta || !payload.data) {
        return { success: false, error: 'Esquema inválido: chaves "meta" ou "data" ausentes.' };
      }

      // Integrity Check (Checksum)
      if (!payload.meta.checksum) {
        return { success: false, error: 'Falha de integridade: Checksum ausente.' };
      }

      const calculatedHash = await BackupService._generateChecksum(payload.data);
      if (calculatedHash !== payload.meta.checksum) {
        return { success: false, error: 'Arquivo corrompido ou adulterado (Checksum Mismatch).' };
      }

      // TODO: Future version compatibility checks can be added here

      // Transactional Restoration: Clear then Set
      // We accept a small risk window here as indexedDB/chrome.storage lacks real transactions
      // But we mitigate by validiting JSON parsability first.

      await chrome.storage.local.clear();
      await chrome.storage.local.set(payload.data);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Falha desconhecida na restauração.' };
    }
  }
  /**
   * Generates a SHA-256 hash of the data object.
   * @param {Object} data
   * @returns {Promise<string>} Hex representation of the hash.
   * @private
   */
  static async _generateChecksum(data) {
    // Sort keys to ensure canonical JSON string
    const canonicalString = JSON.stringify(data, Object.keys(data).sort());
    const msgBuffer = new TextEncoder().encode(canonicalString);

    // Use crypto.subtle (available in Extension environment)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
