connector_pictures_DAM = require('./connector_pictures_DAM');
connector_users_tags = require('./connector_users_tags');
connector_doc_smk = require('./connector_doc_smk');
connector_CollectionSpace = require('./connector_CollectionSpace');

var config = {

    version :  '000.001.045',
            
    // dam
    dam:{  	   
          'foto': connector_pictures_DAM,
          'tags': connector_users_tags,
          'doc': connector_doc_smk,
          'collectionspace': connector_CollectionSpace            
    },   
    
    // proxy
    proxy:{
  	   options: {
  	      validHttpMethods: ['GET'],
  	      invalidParams: ['qt', 'stream']
  	    },
        mapping:{
          'solr-example/dev_DAM/select': connector_pictures_DAM,
          'solr-h4dk/prod_search_pict/select': connector_users_tags,
          'solr/gettingstarted_shard1_replica1/select': connector_doc_smk,
          'solr-example/dev_SAFO/select': connector_CollectionSpace
        }    
    },        
    
    // Import parameters        
    dummy: false,
    last_processed: 'kms3432',
    maxFileSize:  3000000000, // ---> control on size does'nt work??!! -> try with kms3696 8bit  
    solrParamsImportAll: {
                //'q': 'invnumber%3Akms*+AND+(type%3A".tif"+OR+type%3A".jpg")',
                'q': 'invnumber:kms* AND (type:".tif" OR type:".jpg" OR type:".tiff" OR type:".jpeg")',
                //'fq': 'invnumber:kms*',                
                //'q': '*:*',
                'facet.limit': -1,
                                
                'rows': 0,                
                'facet': 'true',
                'facet.mincount': 1,                
                'facet.field': 'invnumber',
                'f.invnumber.facet.sort': 'index',                
                
                'wt': 'json',
                'indent': 'true',
                'json.nl': 'map'
                                
                
                
            },
    
    // Metadata values
    attribution : "SMK Photo/Skou-Hansen/Buccarella", /*max 32 bytes!*/
    oldAttribution : 'Hans Petersen',
    copyrightDefault : 'Public Domain (CC0)',
    webStatementNoRights : 'http://www.smk.dk/en/copyright/creative-commons/',
    webStatementRights : 'http://www.smk.dk/en/copyright/',
    city : 'Copenhagen',
    country : 'Denmark',
    photo : 'Photographers at SMK',
    smk : 'Statens Museum for Kunst',

    // Solr corpus
    solrHost : '172.20.1.73',
    solrPort : 8080,
    solrCore : '/solr/prod_SQL_full_export/select',
    
    // Solr dam
    solrDAMHost : 'csdev-seb-02',
    solrDAMPort : 8983,
    solrDAMCore : '/solr/dev_DAM_PIC/',
    
    // Solr tag
    /*
    solrTagHost : '172.20.1.94',
    solrTagPort : 8080,
    solrTagCore : '/solr-h4dk/prod_search_pict/',
    */
    solrTagHost: 'csdev-seb-02',
    solrTagPort: 8983,
    solrTagCore: '/solr/dev_TAGS_PIC/',

    // IIP
    IIPHost : '172.20.1.203',
    IIPPath : '/iipsrv/iipsrv.fcgi',
    IIPImageSize:{
              thumb: 100,
              medium: 200,
              large: 500    
    },    

    smkInventoryNumber : 'Iptc.Application2.ObjectName',
    originalCopyright : 'Iptc.Application2.Copyright',
    tempFilePath : '/tmp/',
    root : '/mnt/fotoII/',
    port : 4000,
    
    storage: {
      dev: '/mnt/damapistorage/dev/',
      test: '/mnt/damapistorage/test/',
      prod: '/mnt/damapistorage/prod/'              
    },
    
    // Mounts
    mnt: {fotoI: '/mnt/fotoI/',
          fotoII: '/mnt/fotoII/',
        	groups: '/mnt/cifs/groups/'
    }               
}

module.exports = config;

