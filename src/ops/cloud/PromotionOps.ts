import { get } from 'lodash';
import {
    getLockStatus,
    lock,
    unlock,
    promote,
    getStatus,
    getProvisionalReport,
    getReports,
    getLastReport,
    getReportById,
    buildReport,
    PromoteInfos,
    PromoteOptions,
    PromoteResponse,
    PromotionStatus,
    LockResponse,
    LockStatus,
    Report,
    PromotionReportSummary
  } from '../../api/cloud/PromotionApi';

import { State } from '../../shared/State';

export type Promotion = {
  getLockStatus(): Promise<LockStatus>;
  lock(): Promise<LockResponse>;
  unlock(promotionId: string): Promise<LockResponse>;
  promote(options: PromoteOptions, infos: PromoteInfos): Promise<PromoteResponse>;
  getStatus(): Promise<PromotionStatus>;
  getProvisionalReport(): Promise<Report>;
  getReports(): Promise<PromotionReportSummary[]>;
  getLastReport(): Promise<Report>;
  getReportById(reportId: string): Promise<Report>;
  buildReport(): Promise<Report>;
};

export default (state: State): Promotion => {
  return {
    getLockStatus: async (): Promise<LockStatus> => getLockStatus({state}),
    lock: async (): Promise<LockResponse> => lock({state}),
    unlock: async (promotionId: string): Promise<LockResponse> => unlock({promotionId, state}),
    promote: async (options: PromoteOptions, infos: PromoteInfos): Promise<PromoteResponse> => promote({options, infos, state}),
    getStatus: async (): Promise<PromotionStatus> => getStatus({state}),
    getProvisionalReport: async (): Promise<Report> => getProvisionalReport({state}),
    getReports: async (): Promise<PromotionReportSummary[]> => getReports({state}),
    getLastReport: async (): Promise<Report> => getLastReport({state}),
    getReportById: async (reportId: string): Promise<Report> => getReportById({reportId, state}),
    buildReport: async (): Promise<Report> => buildReport({state}),
  }
}
 
