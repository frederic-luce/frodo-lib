import { get } from 'lodash';
import {
    getLockStatus,
    lock,
    unlock,
    promote,
    getStatus,
    getProvisionalReport,
    PromoteInfos,
    PromoteOptions,
    PromoteResponse,
    PromotionStatus,
    LockResponse,
    LockStatus
    
  } from '../../api/cloud/PromotionApi';
import State from '../../shared/State';
  
export default (state: State) => {
  return {

    getLockStatus: async (): Promise<LockStatus> => getLockStatus({state}),
    lock: async (): Promise<LockResponse> => lock({state}),
    unlock: async (promotionId: string): Promise<LockResponse> => unlock({promotionId, state}),
    promote: async (options: PromoteOptions, infos: PromoteInfos): Promise<PromoteResponse> => promote({options, infos, state}),
    getStatus: async (): Promise<PromotionStatus> => getStatus({state}),
    getProvisionalReport: async (): Promise<any> => getProvisionalReport({state}),
  }
}
 
