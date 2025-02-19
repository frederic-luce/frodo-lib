import util from 'util';

import { State } from '../shared/State';
import { getHostBaseUrl } from '../utils/ForgeRockUtils';
import { generateIdmApi } from './BaseApi';

const testConnectorServersURLTemplate =
  '%s/openidm/system?_action=testConnectorServers';

export interface ConnectorServerStatusInterface {
  name: string;
  type: string;
  ok: boolean;
}

export interface TestConnectorServersInterface {
  openicf: ConnectorServerStatusInterface[];
}

/**
 * Test connector servers
 * @returns {Promise<TestConnectorServersInterface>} a promise that resolves to a TestConnectorServersInterface object
 */
export async function testConnectorServers({
  state,
}: {
  state: State;
}): Promise<TestConnectorServersInterface> {
  const urlString = util.format(
    testConnectorServersURLTemplate,
    getHostBaseUrl(state.getHost())
  );
  const { data } = await generateIdmApi({ state, requestOverride: {} }).post(
    urlString
  );
  return data as TestConnectorServersInterface;
}
