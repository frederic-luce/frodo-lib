import {
  Saml2ProiderLocation,
  Saml2ProviderSkeleton,
  Saml2ProviderStub,
  createProvider as _createProvider,
  updateProvider as _updateProvider,
  queryProviderStubs as _queryProviderStubs,
  getProvider as _getProviderByLocationAndId,
  getProviderMetadata as _getProviderMetadata,
  getProviderMetadataUrl as _getProviderMetadataUrl,
  getProviderStubs as _getProviderStubs,
  deleteProvider as _deleteProvider,
} from '../api/Saml2Api';
import { getScript } from '../api/ScriptApi';
import {
  decode,
  decodeBase64Url,
  encode,
  encodeBase64Url,
} from '../utils/Base64Utils';
import { MultiOpStatusInterface, Saml2ExportInterface } from './OpsTypes';
import { putScript } from './ScriptOps';
import { debugMessage, printMessage } from '../utils/Console';
import {
  convertBase64TextToArray,
  convertBase64UrlTextToArray,
  convertTextArrayToBase64,
  convertTextArrayToBase64Url,
  getMetadata,
} from '../utils/ExportImportUtils';
import { State } from '../shared/State';
import { get } from '../utils/JsonUtils';

export type Saml2 = {
  /**
   * Read all SAML2 entity provider stubs
   * @returns {Promise<Saml2ProviderStub[]>} a promise that resolves to an array of saml2 entity stubs
   */
  readSaml2ProviderStubs(): Promise<Saml2ProviderStub[]>;
  /**
   *
   * @param {string} entityId Provider entity id
   * @returns {Promise<Saml2ProviderStub>} Promise resolving to a Saml2ExportInterface object.
   */
  readSaml2ProviderStub(entityId: string): Promise<Saml2ProviderStub>;
  /**
   * Export a single entity provider. The response can be saved to file as is.
   * @param {string} entityId Provider entity id
   * @returns {Promise<Saml2ProviderSkeleton>} Promise resolving to a Saml2ExportInterface object.
   */
  readSaml2Provider(entityId: string): Promise<Saml2ProviderSkeleton>;
  /**
   * Create a SAML2 entity provider
   * @param {Saml2ProiderLocation} location 'hosted' or 'remote'
   * @param {Saml2ProviderSkeleton} providerData Object representing a SAML entity provider
   * @param {string} metaData Base64-encoded metadata XML. Only required for remote providers
   * @returns {Promise<Saml2ProviderSkeleton>} a promise that resolves to a saml2 entity provider object
   */
  createSaml2Provider(
    location: Saml2ProiderLocation,
    providerData: Saml2ProviderSkeleton,
    metaData: string
  ): Promise<Saml2ProviderSkeleton>;
  /**
   * Update SAML2 entity provider
   * @param {Saml2ProiderLocation} location Entity provider location (hosted or remote)
   * @param {string} entityId SAML2 entity id
   * @param {Saml2ProviderSkeleton} providerData Object representing a SAML entity provider
   * @returns {Promise<Saml2ProviderSkeleton>} a promise that resolves to a saml2 entity provider object
   */
  updateSaml2Provider(
    location: Saml2ProiderLocation,
    providerData: Saml2ProviderSkeleton,
    entityId?: string
  ): Promise<Saml2ProviderSkeleton>;
  /**
   * Delete an entity provider. The response can be saved to file as is.
   * @param {string} entityId Provider entity id
   * @returns {Promise<Saml2ProviderSkeleton>} Promise resolving to a Saml2ExportInterface object.
   */
  deleteSaml2Provider(entityId: string): Promise<Saml2ProviderSkeleton>;
  /**
   * Delete all entity providers.
   * @returns {Promise<Saml2ProviderSkeleton[]>} Promise resolving to an array of Saml2ProviderSkeleton objects.
   */
  deleteSaml2Providers(): Promise<Saml2ProviderSkeleton[]>;
  /**
   * Get a SAML2 entity provider's metadata URL by entity id
   * @param {string} entityId SAML2 entity id
   * @returns {string} the URL to get the metadata from
   */
  getSaml2ProviderMetadataUrl(entityId: string): string;
  /**
   * Get a SAML2 entity provider's metadata by entity id
   * @param {string} entityId SAML2 entity id
   * @returns {Promise<object>} a promise that resolves to an object containing a SAML2 metadata
   */
  getSaml2ProviderMetadata(entityId: string): Promise<any>;
  /**
   * Export a single entity provider. The response can be saved to file as is.
   * @param {string} entityId Provider entity id
   * @returns {Promise<Saml2ExportInterface>} Promise resolving to a Saml2ExportInterface object.
   */
  exportSaml2Provider(entityId: string): Promise<Saml2ExportInterface>;
  /**
   * Export all entity providers. The response can be saved to file as is.
   * @returns {Promise<Saml2ExportInterface>} Promise resolving to a Saml2ExportInterface object.
   */
  exportSaml2Providers(): Promise<Saml2ExportInterface>;
  /**
   * Import a SAML entity provider
   * @param {string} entityId Provider entity id
   * @param {Saml2ExportInterface} importData Import data
   */
  importSaml2Provider(
    entityId: string,
    importData: Saml2ExportInterface
  ): Promise<boolean>;
  /**
   * Import SAML entity providers
   * @param {Saml2ExportInterface} importData Import data
   */
  importSaml2Providers(
    importData: Saml2ExportInterface
  ): Promise<MultiOpStatusInterface>;

  // Deprecated

  /**
   * Get SAML2 entity provider stubs
   * @returns {Promise<Saml2ProviderStub[]>} a promise that resolves to an array of saml2 entity stubs
   * @deprecated since v2.0.0 use {@link Saml2.readSaml2ProviderStubs | readSaml2ProviderStubs} instead
   * ```javascript
   * readSaml2ProviderStubs(): Promise<Saml2ProviderStub[]>
   * ```
   * @group Deprecated
   */
  getSaml2ProviderStubs(): Promise<Saml2ProviderStub[]>;
  /**
   * Get a SAML2 entity provider's metadata URL by entity id
   * @param {string} entityId SAML2 entity id
   * @returns {string} the URL to get the metadata from
   * @deprecated since v2.0.0 use {@link Saml2.getSaml2ProviderMetadataUrl | getSaml2ProviderMetadataUrl} instead
   * ```javascript
   * getSaml2ProviderMetadataUrl(entityId: string): string
   * ```
   * @group Deprecated
   */
  getProviderMetadataUrl(entityId: string): string;
  /**
   * Get a SAML2 entity provider's metadata by entity id
   * @param {string} entityId SAML2 entity id
   * @returns {Promise<any>} a promise that resolves to an object containing a SAML2 metadata
   * @deprecated since v2.0.0 use {@link Saml2.getSaml2ProviderMetadata | getSaml2ProviderMetadata} instead
   * ```javascript
   * getSaml2ProviderMetadata(entityId: string): Promise<any>
   * ```
   * @group Deprecated
   */
  getProviderMetadata(entityId: string): Promise<any>;
  /**
   *
   * @param {string} entityId Provider entity id
   * @returns {Promise<Saml2ProviderStub>} Promise resolving to a Saml2ExportInterface object.
   * @deprecated since v2.0.0 use {@link Saml2.readSaml2ProviderStub | readSaml2ProviderStub} instead
   * ```javascript
   * readSaml2ProviderStub(entityId: string): Promise<Saml2ProviderStub>
   * ```
   * @group Deprecated
   */
  getSaml2ProviderStub(entityId: string): Promise<Saml2ProviderStub>;
  /**
   * Export a single entity provider. The response can be saved to file as is.
   * @param {string} entityId Provider entity id
   * @returns {Promise<Saml2ProviderSkeleton>} Promise resolving to a Saml2ExportInterface object.
   * @deprecated since v2.0.0 use {@link Saml2.readSaml2Provider | readSaml2Provider} instead
   * ```javascript
   * readSaml2Provider(entityId: string): Promise<Saml2ProviderSkeleton>
   * ```
   * @group Deprecated
   */
  getSaml2Provider(entityId: string): Promise<Saml2ProviderSkeleton>;
};

export default (state: State): Saml2 => {
  return {
    async readSaml2ProviderStubs(): Promise<Saml2ProviderStub[]> {
      return readSaml2ProviderStubs({ state });
    },
    async readSaml2ProviderStub(entityId: string): Promise<Saml2ProviderStub> {
      return readSaml2ProviderStub({ entityId, state });
    },
    async readSaml2Provider(entityId: string): Promise<Saml2ProviderSkeleton> {
      return readSaml2Provider({ entityId, state });
    },
    async createSaml2Provider(
      location: Saml2ProiderLocation,
      providerData: Saml2ProviderSkeleton,
      metaData: string
    ): Promise<Saml2ProviderSkeleton> {
      return createSaml2Provider({ location, providerData, metaData, state });
    },
    async updateSaml2Provider(
      location: Saml2ProiderLocation,
      providerData: Saml2ProviderSkeleton,
      entityId?: string
    ): Promise<Saml2ProviderSkeleton> {
      return updateSaml2Provider({ location, providerData, entityId, state });
    },
    async deleteSaml2Provider(
      entityId: string
    ): Promise<Saml2ProviderSkeleton> {
      return deleteSaml2Provider({ entityId, state });
    },
    async deleteSaml2Providers(): Promise<Saml2ProviderSkeleton[]> {
      return deleteSaml2Providers({ state });
    },
    getSaml2ProviderMetadataUrl(entityId: string): string {
      return getSaml2ProviderMetadataUrl({ entityId, state });
    },
    async getSaml2ProviderMetadata(entityId: string) {
      return getSaml2ProviderMetadata({ entityId, state });
    },
    async exportSaml2Provider(entityId: string): Promise<Saml2ExportInterface> {
      return exportSaml2Provider({ entityId, state });
    },
    async exportSaml2Providers(): Promise<Saml2ExportInterface> {
      return exportSaml2Providers({ state });
    },
    async importSaml2Provider(
      entityId: string,
      importData: Saml2ExportInterface
    ): Promise<boolean> {
      return importSaml2Provider({ entityId, importData, state });
    },
    async importSaml2Providers(
      importData: Saml2ExportInterface
    ): Promise<MultiOpStatusInterface> {
      return importSaml2Providers({ importData, state });
    },

    // Deprecated

    async getSaml2ProviderStubs(): Promise<Saml2ProviderStub[]> {
      return readSaml2ProviderStubs({ state });
    },
    getProviderMetadataUrl(entityId: string): string {
      return getSaml2ProviderMetadataUrl({ entityId, state });
    },
    async getProviderMetadata(entityId: string) {
      return getSaml2ProviderMetadata({ entityId, state });
    },
    async getSaml2ProviderStub(entityId: string): Promise<Saml2ProviderStub> {
      return readSaml2ProviderStub({ entityId, state });
    },
    async getSaml2Provider(entityId: string): Promise<Saml2ProviderSkeleton> {
      return readSaml2Provider({ entityId, state });
    },
  };
};

// use a function vs a template variable to avoid problems in loops
export function createSaml2ExportTemplate({
  state,
}: {
  state: State;
}): Saml2ExportInterface {
  return {
    meta: getMetadata({ state }),
    script: {},
    saml: {
      hosted: {},
      remote: {},
      metadata: {},
    },
  } as Saml2ExportInterface;
}

/**
 * Get SAML2 entity provider stubs
 * @returns {Promise<Saml2ProviderStub[]>} a promise that resolves to an array of saml2 entity stubs
 */
export async function readSaml2ProviderStubs({
  state,
}: {
  state: State;
}): Promise<Saml2ProviderStub[]> {
  const { result } = await _getProviderStubs({ state });
  return result;
}

/**
 * Get a SAML2 entity provider's metadata URL by entity id
 * @param {string} entityId SAML2 entity id
 * @returns {string} the URL to get the metadata from
 */
export function getSaml2ProviderMetadataUrl({
  entityId,
  state,
}: {
  entityId: string;
  state: State;
}): string {
  return _getProviderMetadataUrl({ entityId, state });
}

/**
 * Get a SAML2 entity provider's metadata by entity id
 * @param {string} entityId SAML2 entity id
 * @returns {Promise<object>} a promise that resolves to an object containing a SAML2 metadata
 */
export async function getSaml2ProviderMetadata({
  entityId,
  state,
}: {
  entityId: string;
  state: State;
}) {
  return _getProviderMetadata({ entityId, state });
}

/**
 * Include dependencies in the export file
 * @param {object} providerData Object representing a SAML entity provider
 * @param {object} fileData File data object to add dependencies to
 */
async function exportDependencies({
  providerData,
  fileData,
  state,
}: {
  providerData: Saml2ProviderSkeleton;
  fileData: Saml2ExportInterface;
  state: State;
}) {
  const attrMapperScriptId = get(providerData, [
    'identityProvider',
    'assertionProcessing',
    'attributeMapper',
    'attributeMapperScript',
  ]);
  if (attrMapperScriptId && attrMapperScriptId !== '[Empty]') {
    const scriptData = await getScript({ scriptId: attrMapperScriptId, state });
    scriptData.script = convertBase64TextToArray(scriptData.script);
    fileData.script[attrMapperScriptId] = scriptData;
  }
  const idpAdapterScriptId = get(providerData, [
    'identityProvider',
    'advanced',
    'idpAdapter',
    'idpAdapterScript',
  ]);
  if (idpAdapterScriptId && idpAdapterScriptId !== '[Empty]') {
    const scriptData = await getScript({ scriptId: idpAdapterScriptId, state });
    scriptData.script = convertBase64TextToArray(scriptData.script);
    fileData.script[idpAdapterScriptId] = scriptData;
  }
  const metaDataResponse = await getSaml2ProviderMetadata({
    entityId: providerData.entityId,
    state,
  });
  if (!metaDataResponse) {
    throw new Error(
      `Unable to obtain metadata from ${getSaml2ProviderMetadataUrl({
        entityId: providerData.entityId,
        state,
      })}`
    );
  }
  fileData.saml.metadata[providerData._id] = convertBase64UrlTextToArray(
    encodeBase64Url(metaDataResponse)
  );
}

/**
 *
 * @param {string} entityId Provider entity id
 * @returns {Promise<Saml2ProviderStub>} Promise resolving to a Saml2ExportInterface object.
 */
export async function readSaml2ProviderStub({
  entityId,
  state,
}: {
  entityId: string;
  state: State;
}): Promise<Saml2ProviderStub> {
  debugMessage({
    message: `Saml2Ops.getSaml2ProviderStub: start [entityId=${entityId}]`,
    state,
  });
  const found = await _queryProviderStubs({
    filter: `entityId eq '${entityId}'`,
    state,
  });
  switch (found.resultCount) {
    case 0:
      throw new Error(`No provider with entity id '${entityId}' found`);
    case 1: {
      debugMessage({
        message: `Saml2Ops.getSaml2ProviderStub: end [entityId=${entityId}]`,
        state,
      });
      return found.result[0];
    }
    default:
      throw new Error(`Multiple providers with entity id '${entityId}' found`);
  }
}

/**
 * Export a single entity provider. The response can be saved to file as is.
 * @param {string} entityId Provider entity id
 * @returns {Promise<Saml2ProviderSkeleton>} Promise resolving to a Saml2ExportInterface object.
 */
export async function readSaml2Provider({
  entityId,
  state,
}: {
  entityId: string;
  state: State;
}): Promise<Saml2ProviderSkeleton> {
  debugMessage({
    message: `Saml2Ops.getSaml2Provider: start [entityId=${entityId}]`,
    state,
  });
  const stub = await readSaml2ProviderStub({ entityId, state });
  const { location } = stub;
  const entityId64 = stub._id;
  const providerData = await _getProviderByLocationAndId({
    location,
    entityId64,
    state,
  });
  debugMessage({
    message: `Saml2Ops.getSaml2Provider: end [entityId=${entityId}]`,
    state,
  });
  return providerData;
}

/**
 * Create a SAML2 entity provider
 * @param {Saml2ProiderLocation} location 'hosted' or 'remote'
 * @param {Saml2ProviderSkeleton} providerData Object representing a SAML entity provider
 * @param {string} metaData Base64-encoded metadata XML. Only required for remote providers
 * @returns {Promise<Saml2ProviderSkeleton>} a promise that resolves to a saml2 entity provider object
 */
export async function createSaml2Provider({
  location,
  providerData,
  metaData,
  state,
}: {
  location: Saml2ProiderLocation;
  providerData: Saml2ProviderSkeleton;
  metaData?: string;
  state: State;
}): Promise<Saml2ProviderSkeleton> {
  return _createProvider({ location, providerData, metaData, state });
}

/**
 * Update SAML2 entity provider
 * @param {Saml2ProiderLocation} location Entity provider location (hosted or remote)
 * @param {string} entityId SAML2 entity id
 * @param {Saml2ProviderSkeleton} providerData Object representing a SAML entity provider
 * @returns {Promise<Saml2ProviderSkeleton>} a promise that resolves to a saml2 entity provider object
 */
export async function updateSaml2Provider({
  location,
  entityId = undefined,
  providerData,
  state,
}: {
  location: Saml2ProiderLocation;
  entityId?: string;
  providerData: Saml2ProviderSkeleton;
  state: State;
}): Promise<Saml2ProviderSkeleton> {
  return _updateProvider({ location, entityId, providerData, state });
}

/**
 * Delete an entity provider. The response can be saved to file as is.
 * @param {string} entityId Provider entity id
 * @returns {Promise<Saml2ProviderSkeleton>} Promise resolving to a Saml2ExportInterface object.
 */
export async function deleteSaml2Provider({
  entityId,
  state,
}: {
  entityId: string;
  state: State;
}): Promise<Saml2ProviderSkeleton> {
  debugMessage({
    message: `Saml2Ops.deleteSaml2Provider: start [entityId=${entityId}]`,
    state,
  });
  const stub = await readSaml2ProviderStub({ entityId, state });
  const { location } = stub;
  const id = stub._id;
  const providerData = await _deleteProvider({
    location,
    entityId64: id,
    state,
  });
  debugMessage({
    message: `Saml2Ops.deleteSaml2Provider: end [entityId=${entityId}]`,
    state,
  });
  return providerData;
}

/**
 * Delete all entity providers.
 * @returns {Promise<Saml2ProviderSkeleton[]>} Promise resolving to an array of Saml2ProviderSkeleton objects.
 */
export async function deleteSaml2Providers({
  state,
}: {
  state: State;
}): Promise<Saml2ProviderSkeleton[]> {
  debugMessage({ message: `Saml2Ops.deleteSaml2Providers: start`, state });
  const providers: Saml2ProviderSkeleton[] = [];
  const stubs = await readSaml2ProviderStubs({ state });
  for (const stub of stubs) {
    const provider = await _deleteProvider({
      location: stub.location,
      entityId64: stub._id,
      state,
    });
    providers.push(provider);
  }
  debugMessage({
    message: `Saml2Ops.deleteSaml2Providers: end [deleted ${providers.length} providers]`,
    state,
  });
  return providers;
}

/**
 * Export a single entity provider. The response can be saved to file as is.
 * @param {string} entityId Provider entity id
 * @returns {Promise<Saml2ExportInterface>} Promise resolving to a Saml2ExportInterface object.
 */
export async function exportSaml2Provider({
  entityId,
  state,
}: {
  entityId: string;
  state: State;
}): Promise<Saml2ExportInterface> {
  debugMessage({
    message: `Saml2Ops.exportSaml2Provider: start [entityId=${entityId}]`,
    state,
  });
  const exportData = createSaml2ExportTemplate({ state });
  const stub = await readSaml2ProviderStub({ entityId, state });
  const { location } = stub;
  const id = stub._id;
  const providerData = await _getProviderByLocationAndId({
    location,
    entityId64: id,
    state,
  });
  exportData.saml[stub.location][providerData._id] = providerData;
  try {
    await exportDependencies({ providerData, fileData: exportData, state });
  } catch (error) {
    printMessage({ message: error.message, type: 'error', state });
  }
  debugMessage({
    message: `Saml2Ops.exportSaml2Provider: end [entityId=${entityId}]`,
    state,
  });
  return exportData;
}

/**
 * Export all entity providers. The response can be saved to file as is.
 * @returns {Promise<Saml2ExportInterface>} Promise resolving to a Saml2ExportInterface object.
 */
export async function exportSaml2Providers({
  state,
}: {
  state: State;
}): Promise<Saml2ExportInterface> {
  const fileData = createSaml2ExportTemplate({ state });
  const stubs = await readSaml2ProviderStubs({ state });
  for (const stub of stubs) {
    const providerData = await _getProviderByLocationAndId({
      location: stub.location,
      entityId64: stub._id,
      state,
    });
    try {
      await exportDependencies({ providerData, fileData, state });
    } catch (error) {
      printMessage({ message: error, type: 'error', state });
    }
    fileData.saml[stub.location][providerData._id] = providerData;
  }
  return fileData;
}

/**
 * Include dependencies from the import file
 * @param {object} providerData Object representing a SAML entity provider
 * @param {object} fileData File data object to read dependencies from
 */
async function importDependencies({
  providerData,
  fileData,
  state,
}: {
  providerData: Saml2ProviderSkeleton;
  fileData: Saml2ExportInterface;
  state: State;
}) {
  debugMessage({ message: `Saml2Ops.importDependencies: start`, state });
  const attrMapperScriptId = get(providerData, [
    'identityProvider',
    'assertionProcessing',
    'attributeMapper',
    'attributeMapperScript',
  ]);
  if (attrMapperScriptId && attrMapperScriptId !== '[Empty]') {
    debugMessage({
      message: `Saml2Ops.importDependencies: attributeMapperScript=${attrMapperScriptId}`,
      state,
    });
    const scriptData = get(fileData, ['script', attrMapperScriptId]);
    scriptData.script = convertTextArrayToBase64(scriptData.script as string[]);
    await putScript({ scriptId: attrMapperScriptId, scriptData, state });
  }
  const idpAdapterScriptId = get(providerData, [
    'identityProvider',
    'advanced',
    'idpAdapter',
    'idpAdapterScript',
  ]);
  if (idpAdapterScriptId && idpAdapterScriptId !== '[Empty]') {
    debugMessage({
      message: `Saml2Ops.importDependencies: idpAdapterScript=${idpAdapterScriptId}`,
      state,
    });
    const scriptData = get(fileData, ['script', idpAdapterScriptId]);
    scriptData.script = convertTextArrayToBase64(scriptData.script as string[]);
    await putScript({ scriptId: idpAdapterScriptId, scriptData, state });
  }
  debugMessage({ message: `Saml2Ops.importDependencies: end`, state });
}

/**
 * Find provider in import file and return its location
 * @param {string} entityId64 Base64-encoded provider entity id
 * @param {Saml2ExportInterface} data Import file json data
 * @returns {string} 'hosted' or 'remote' if found, undefined otherwise
 */
function getLocation(
  entityId64: string,
  data: Saml2ExportInterface
): Saml2ProiderLocation {
  if (data.saml.hosted[entityId64]) {
    return 'hosted';
  }
  if (data.saml.remote[entityId64]) {
    return 'remote';
  }
  return undefined;
}

/**
 * Import a SAML entity provider
 * @param {string} entityId Provider entity id
 * @param {Saml2ExportInterface} importData Import data
 */
export async function importSaml2Provider({
  entityId,
  importData,
  state,
}: {
  entityId: string;
  importData: Saml2ExportInterface;
  state: State;
}): Promise<boolean> {
  debugMessage({ message: `Saml2Ops.importSaml2Provider: start`, state });
  const entityId64 = encode(entityId, false);
  const location = getLocation(entityId64, importData);
  debugMessage({
    message: `Saml2Ops.importSaml2Provider: entityId=${entityId}, entityId64=${entityId64}, location=${location}`,
    state,
  });
  if (location) {
    const providerData = importData.saml[location][entityId64];
    await importDependencies({ providerData, fileData: importData, state });
    let metaData = null;
    if (location === 'remote') {
      metaData = convertTextArrayToBase64Url(
        importData.saml.metadata[entityId64]
      );
    }
    try {
      await _createProvider({ location, providerData, metaData, state });
    } catch (error) {
      await _updateProvider({ location, providerData, state });
    }
  } else {
    throw new Error(`Provider ${entityId} not found in import data!`);
  }
  debugMessage({ message: `Saml2Ops.importSaml2Provider: end`, state });
  return true;
}

/**
 * Import SAML entity providers
 * @param {Saml2ExportInterface} importData Import data
 */
export async function importSaml2Providers({
  importData,
  state,
}: {
  importData: Saml2ExportInterface;
  state: State;
}): Promise<MultiOpStatusInterface> {
  debugMessage({ message: `Saml2Ops.importSaml2Providers: start`, state });
  const myStatus: MultiOpStatusInterface = {
    total: 0,
    successes: 0,
    warnings: 0,
    failures: 0,
  };
  try {
    // find providers in hosted and in remote and map locations
    const hostedIds = Object.keys(importData.saml.hosted);
    const remoteIds = Object.keys(importData.saml.remote);
    const providerIds = hostedIds.concat(remoteIds);
    myStatus.total = providerIds.length;
    for (const entityId64 of providerIds) {
      debugMessage({
        message: `Saml2Ops.importSaml2Providers: entityId=${decodeBase64Url(
          entityId64
        )}`,
        state,
      });
      const location: Saml2ProiderLocation = hostedIds.includes(entityId64)
        ? 'hosted'
        : 'remote';
      const entityId = decode(entityId64);
      const providerData = importData.saml[location][entityId64];
      try {
        await importDependencies({ providerData, fileData: importData, state });
      } catch (importDependenciesErr) {
        myStatus.warnings += 1;
        printMessage({
          message: `\nWarning importing dependencies for ${entityId}`,
          state,
          type: 'warn',
        });
        printMessage({
          message: importDependenciesErr.response.data,
          type: 'error',
          state,
        });
      }
      let metaData = null;
      if (location === 'remote') {
        metaData = convertTextArrayToBase64Url(
          importData.saml.metadata[entityId64]
        );
      }
      try {
        await _createProvider({ location, providerData, metaData, state });
        myStatus.successes += 1;
      } catch (createProviderErr) {
        try {
          await _updateProvider({ location, providerData, state });
          myStatus.successes += 1;
        } catch (updateProviderError) {
          myStatus.failures += 1;
          printMessage({
            message: `\nError importing provider ${entityId}: ${updateProviderError.message}`,
            state,
            type: 'error',
          });
          printMessage({
            message: updateProviderError.response?.data,
            type: 'error',
            state,
          });
        }
      }
    }
    myStatus.message = `${myStatus.successes}/${myStatus.total} providers imported.`;
  } catch (error) {
    myStatus.failures += 1;
    printMessage({
      message: `\nError importing providers ${error.message}`,
      type: 'error',
      state,
    });
  }
  debugMessage({ message: `Saml2Ops.importSaml2Providers: end`, state });
  return myStatus;
}
