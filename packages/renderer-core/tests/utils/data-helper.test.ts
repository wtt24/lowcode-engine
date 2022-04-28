// @ts-nocheck
import { DataHelper } from '../../src/utils/data-helper';
import { parseData } from '../../src/utils/common';


describe('test DataHelper ', () => {
  it('can be inited', () => {
    const mockHost = {};
    let mockDataSourceConfig = {};
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    let dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    expect(dataHelper).toBeTruthy();
    expect(dataHelper.host).toBe(mockHost);
    expect(dataHelper.config).toBe(mockDataSourceConfig);
    expect(dataHelper.appHelper).toBe(mockAppHelper);
    expect(dataHelper.parser).toBe(mockParser);


    dataHelper = new DataHelper(mockHost, undefined, mockAppHelper, mockParser);
    expect(dataHelper.config).toStrictEqual({});
    expect(dataHelper.ajaxList).toStrictEqual([]);

    mockDataSourceConfig = { 
      list: [ 
        {
          id: 'ds1',
        }, {
          id: 'ds2',
        },
      ]
    };
    dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    expect(dataHelper.config).toBe(mockDataSourceConfig);
    expect(dataHelper.ajaxList.length).toBe(2);
    expect(dataHelper.ajaxMap.ds1).toStrictEqual({
      id: 'ds1',
    });
  });
  it('should handle generateDataSourceMap properly', () => {
    const mockHost = {};
    let mockDataSourceConfig = {};
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    let dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    // test generateDataSourceMap logic
    mockDataSourceConfig = { 
      list: [ 
        {
          id: 'getInfo',
          isInit: true,
          type: 'fetch',  // fetch/mtop/jsonp/custom
          options: {
            uri: 'mock/info.json',
            method: 'GET',
            params: { a: 1 },
            timeout: 5000,
          },
        }, {
          id: 'postInfo',
          isInit: true,
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        },
      ]
    };
    dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    expect(Object.keys(dataHelper.dataSourceMap).length).toBe(2);
    expect(dataHelper.dataSourceMap.getInfo.status).toBe('init');
    expect(typeof dataHelper.dataSourceMap.getInfo.load).toBe('function');
  });

  it('getInitData should work', () => {
    const mockHost = {};
    let mockDataSourceConfig = {};
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);

    // test generateDataSourceMap logic
    mockDataSourceConfig = { 
      list: [ 
        {
          id: 'getInfo',
          isInit: true,
          type: 'fetch',  // fetch/mtop/jsonp/custom
          options: {
            uri: 'mock/info.json',
            method: 'GET',
            params: { a: 1 },
            timeout: 5000,
          },
        }, 
        {
          id: 'postInfo',
          isInit: false,
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        }, 
        {
          id: 'getInfoLater',
          isInit: false,
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        },
        {
          id: 'getInfoLater2',
          isInit: 'not a valid boolean',
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        },
      ],
    };

    let dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    expect(dataHelper.getInitDataSourseConfigs().length).toBe(1);
    expect(dataHelper.getInitDataSourseConfigs()[0].id).toBe('getInfo');
  });
});
