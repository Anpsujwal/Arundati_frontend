import api from './axios.instance';

export const communityApi = {
  /** GET all Primary Sects */
  getSects: () => api.get('/community/sects'),

  /** GET Sub-Sects by Primary Sect id */
  getSubSects: (parentId) => api.get('/community/sub-sects', { params: { parentId } }),

  /** Unified search across Primary Sects and Sub-Sects */
  search: (q) => api.get('/community/search', { params: { q } }),

  /** Validate Primary Sect + Sub-Sect combination */
  validate: (primarySectId, subSectId) =>
    api.post('/community/validate', { primarySectId, subSectId }),
};
