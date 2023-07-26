import util from 'util';
import { getTenantURL } from '../utils/ApiUtils';
import { generateEnvApi } from '../BaseApi';
import State from '../../shared/State';

const promotionURLTemplate = '%s/environment/promotion/promote';
const lockURLTemplate = '%s/environment/promotion/lock';
const unlockURLTemplate = '%s/environment/promotion/lock/%s';
const lockStateURLTemplate = '%s/environment/promotion/lock/state';
const provisionnalReportURLTemplate = '%s/environment/promotion/report/provisional';
const reportsURLTemplate = '%s/environment/promotion/reports';
const reportURLTemplate = '%s/environment/promotion/report';
const reportByIdURLTemplate = '%s/environment/promotion/report/%s';

const apiVersion = 'protocol=1.0,resource=1.0';

const getApiConfig = () => ({
  apiVersion,
});

export enum PromotionState {
  ready = 'READY',
  unlocked = 'UNLOCKED',
  inProgress = 'IN_PROGRESS'
}

export enum GlobalLock {
  locked = 'LOCKED',
  unlocked = 'UNLOCKED'
}

export enum LockState {
  locked = 'locked',
  locking = 'locking',
  unlocked = 'unlocked'
}


export interface LockStatus {
  description: string;
  lowerEnv: {
    proxyState: LockState;
    state: LockState;
  };
  result: LockState;
  upperEnv: {
    proxyState: LockState;
    state: LockState;
  };    
}

export interface PromotionStatus {
  status: PromotionState;
  message: string;
  globalLock: GlobalLock;
  blockingError: boolean;
  promotionId: string;
  timeStamp: string;
  missingESVs: string[];
  encryptedSecrets: string[]; 
}

export interface PromoteResponse {
  result: string;
}

export interface PromotionCIMeta {
    name: string,
    realm: string,
    uid: string
}

export interface PromotionReportContent {
  configItem: string,
  configChange: {
    added: PromotionCIMeta[],
    deleted: PromotionCIMeta[],
    modified: PromotionCIMeta[]
  }
}

export interface Report {
  reportId: string,
  reportName: string,
  promotionId: string,
  promoter: string,
  promotionDescription: string,
  createdDate: string,
  report: {
    IDMConfig: PromotionReportContent[]
    AMConfig: PromotionReportContent[]
  },
  missingESVs: string[],
  previouslyIgnoredEncryptedSecrets: string[],
  dryRun: boolean
}

export interface LockResponse {
  promotionId: string;
  result: LockState;
  description: string;
}

/*
{
"dryRun": true,
"ignoreEncryptedSecrets": true,
"zendeskTicketReference": "string",
"promoter": "string",
"promotionDescription": "string",
"unlockEnvironmentsAfterPromotion": true
}
*/
export interface PromotionRequest {
  dryRun: boolean,
  ignoreEncryptedSecrets: boolean | undefined,
  zendeskTicketReference: string | undefined,
  promoter: string | undefined,
  promotionDescription: string | undefined,
  unlockEnvironmentsAfterPromotion: boolean | undefined
}

/**
 * Get status
 * @returns {Promise<RestartStatus>} a promise that resolves to a string indicating status
 */
export async function getStatus({state}:{state:State}): Promise<PromotionStatus> {
  const urlString = util.format(
    promotionURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).get(urlString, {
    withCredentials: true,
  });
  return data;
}

export async function getLockStatus({state}:{state:State}): Promise<LockStatus> {
  const urlString = util.format(
    lockStateURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).get(urlString, {
    withCredentials: true,
  });
  return data;
}

export async function lock({state}:{state:State}): Promise<LockResponse> {
  const urlString = util.format(
    lockURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).post(urlString, {
    withCredentials: true,
  });
  return data;
}

export async function unlock({promotionId, state}:{promotionId: string, state:State}): Promise<LockResponse> {
  const urlString = util.format(
    unlockURLTemplate,
    getTenantURL(state.getHost()),
    promotionId
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).delete(urlString,
    {
    withCredentials: true,
    }
  );
  return data;
}

export interface PromoteOptions {
  dryRun: boolean,
  ignoreEncryptedSecret: boolean | undefined,
  unlockEnvironmentsAfterPromotion: boolean | undefined
}

export interface PromoteInfos {
  ticketReference: string | undefined,
  promoter: string | undefined,
  promotionDescription: string | undefined
}

export async function promote( { options, infos, state }: 
                                        { 
                                          options: PromoteOptions,
                                          infos: PromoteInfos, 
                                          state: State 
                                        } ): Promise<PromoteResponse> {
  const urlString = util.format(
    promotionURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).post(urlString, {...options, ...infos}, {
    withCredentials: true,
  });
  return data;
}

export async function getProvisionalReport({state}:{state:State}): Promise<Report> {
  const urlString = util.format(
    provisionnalReportURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).get(urlString, {
    withCredentials: true,
  });
  return data;
}

export interface PromotionReportSummary {
  reportId: string,
  promotionId: string,
  createdDate: string,
  dryRun: boolean,
}

export async function getReports({state}:{state:State}): Promise<PromotionReportSummary[]> {
  const urlString = util.format(
    reportsURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).get(urlString, {
    withCredentials: true,
  });
  return data;
}

export async function buildReport({state}:{state:State}): Promise<Report> {
  const urlString = util.format(
    reportURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).post(urlString, {
    withCredentials: true,
  });
  return data;
}

export async function getLastReport({state}:{state:State}): Promise<Report> {
  const urlString = util.format(
    reportURLTemplate,
    getTenantURL(state.getHost())
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).get(urlString, {
    withCredentials: true,
  });
  return data;
}

export async function getReportById({reportId, state}:{reportId:string, state:State}): Promise<Report> {
  const urlString = util.format(
    reportByIdURLTemplate,
    getTenantURL(state.getHost()),
    reportId
  );
  const { data } = await generateEnvApi({ resource: getApiConfig(), state }).get(urlString, {
    withCredentials: true,
  });
  return data;
}

/**
 * Initiate restart
 * @returns {Promise<string>} a promise that resolves to a string indicating status
 */
/*export async function initiateRestart(): Promise<RestartStatus> {
  const restartStatus = await getStatus();
  if (restartStatus === RestartStatus.ready) {
    const urlString = util.format(
      startupInitiateRestartURLTemplate,
      getTenantURL(state.getHost())
    );
    const { data } = await generateEnvApi(getApiConfig()).post(
      urlString,
      null,
      {
        withCredentials: true,
      }
    );
    return data.restartStatus;
  }
  throw new Error(`Not ready! Current status: ${restartStatus}`);
}
*/