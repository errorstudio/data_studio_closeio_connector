class CloseIOConnector {

  request: any;
  schema: any;
  configParams: any;
  authType: any;

  constructor(){
    this.request = {};
    this.schema = [
      {
        name: 'id',
        label: 'Close.io ID',
        dataType: 'STRING',
        semantics: {
          conceptType: "DIMENSION"
        }
      },
      {
        name: 'lead_id',
        label: 'Close.io Lead ID',
        dataType: 'STRING',
        semantics: {
          conceptType: "DIMENSION"
        }

      },
      {
        name: 'lead_name',
        label: 'Close.io Lead Name',
        dataType: 'STRING',
        semantics: {
          conceptType: "DIMENSION"
        }
      },
      {
        name: 'lead_status',
        label: 'Close.io Lead Status',
        dataType: 'STRING',
        semantics: {
          conceptType: "DIMENSION"
        }
      },
      {
        name: 'name',
        label: "User's Name",
        dataType: 'STRING',
        semantics: {
          conceptType: "DIMENSION"
        }
      },
      {
        name: 'email',
        label: "User's Email",
        dataType: 'STRING',
        semantics: {
          conceptType: "DIMENSION"
        }

      }


    ];

    this.configParams = [
      {
        type: 'INFO',
        name: 'instructions',
        text: 'Enter your Close.io API key'
      },
      {
        type: 'TEXTINPUT',
        name: 'api_key',
        displayname: 'Enter a key',
        placeholder: 'e.g. bf46dfb32b2f9564cefd7dcdb670f672bcf7588fdf2ae4c152360325e'
      }
    ];

    this.authType = {
      type: 'NONE'
    };
  };

  getData(request) {
    this.request = request;
    const requestedSchema = this.getRequestedFields();
    const leads = this.getLeads();

    console.log("requested fields");
    console.log(requestedSchema.map((s) => s.name));


    // Transform parsed data and filter for requested fields
    let values = [];
    leads.forEach((lead) => {
      lead.webContacts().forEach((contact) => {
        let contactValues = [];
        requestedSchema.forEach((field) => {
          switch (field.name) {
            case 'id':
              contactValues.push(contact.id);
              break;
            case 'lead_id':
              contactValues.push(lead.id);
              break;
            case 'lead_name':
              contactValues.push(lead.name);
              break;
            case 'lead_status':
              contactValues.push(lead.status);
              break;
            case 'email':
              contactValues.push(contact.emailsByType('other')[0].email);
              break;
            case 'name':
              contactValues.push(contact.name);
              break;
            default:
              contactValues.push('');
          }
        });
        values.push({ values: contactValues });
      });
    });



    const content =  {
      schema: requestedSchema,
      rows: values
    };

    return content;
  }

  getRequestedFields() {
    if (!this.request.hasOwnProperty('fields')) {
      throw("Request object has no fields");
    }
    return this.request.fields.map((field) => {
      for (let i = 0; i < this.schema.length; i++) {
        if (this.schema[i].name === field.name) {
          return this.schema[i];
        }
      }
    });
  }

  getLeads(status = ["qualified", "customer"]) {
    if (!this.request.hasOwnProperty('configParams')) {
      throw("Request object has no configParams");
    }

    const statusQuery = status.map((s) => `status:${s}`).join(" or ");
    // const statusQuery = "status:qualified or status:customer";
    try {
      const url = `https://app.close.io/api/v1/lead?per_page=9999999&query=${statusQuery}`;
      const options = {};
      options.headers = {"Authorization": "Basic " + Utilities.base64Encode(this.request.configParams.api_key + ":")};
      const response = UrlFetchApp.fetch(url, options);
      const leads = JSON.parse(response).data;
      // const leads = JSON.parse(this.mockResponse()).data;
      return leads.map((l) => {return new Lead(l)})
    } catch(e) {
      console.error('getLeads() got an error: ' + e);
    }
  }

  mockResponse() {
    return '{"has_more": false, "total_results": 1, "data": [{"status_id": "stat_1ZdiZqcSIkoGVnNOyxiEY58eTGQmFNG3LPlEVQ4V7Nk", "status_label": "Potential", "tasks": [], "display_name": "Wayne Enterprises (Sample Lead)", "addresses": [], "contacts": [{"name": "Bruce Wayne", "title": "The Dark Knight", "date_updated": "2013-02-06T20:53:01.954000+00:00", "phones": [{"phone": "+16503334444", "phone_formatted": "+1 650-333-4444", "type": "office"}], "created_by": null, "id": "cont_o0kP3Nqyq0wxr5DLWIEm8mVr6ZpI0AhonKLDG0V5Qjh", "organization_id": "orga_bwwWG475zqWiQGur0thQshwVXo8rIYecQHDWFanqhen", "date_created": "2013-02-01T00:54:51.331000+00:00", "emails": [{"type": "other", "email_lower": "thedarkknight@close.io", "email": "thedarkknight@close.io"}], "updated_by": "user_04EJPREurd0b3KDozVFqXSRbt2uBjw3QfeYa7ZaGTwI"}], "custom.lcf_ORxgoOQ5YH1p7lDQzFJ88b4z0j7PLLTRaG66m8bmcKv": "Website contact form", "date_updated": "2013-02-06T20:53:01.977000+00:00", "description": "", "html_url": "https://app.close.io/lead/lead_IIDHIStmFcFQZZP0BRe99V1MCoXWz2PGCm6EDmR9v2O/", "created_by": null, "organization_id": "orga_bwwWG475zqWiQGur0thQshwVXo8rIYecQHDWFanqhen", "url": null, "opportunities": [{"id": "oppo_8eB77gAdf8FMy6GsNHEy84f7uoeEWv55slvUjKQZpJt", "organization_id": "orga_bwwWG475zqWiQGur0thQshwVXo8rIYecQHDWFanqhen", "lead_id": "lead_IIDHIStmFcFQZZP0BRe99V1MCoXWz2PGCm6EDmR9v2O", "lead_name": "Wayne Enterprises (Sample Lead)", "status_id": "stat_4ZdiZqcSIkoGVnNOyxiEY58eTGQmFNG3LPlEVQ4V7Nk", "status_label": "Active", "status_type": "active", "value": 50000, "value_period": "one_time", "value_formatted": "$500", "value_currency": "USD", "date_won": null, "confidence": 75, "note": "Bruce needs new software for the Bat Cave.", "user_id": "user_scOgjLAQD6aBSJYBVhIeNr6FJDp8iDTug8Mv6VqYoFn", "user_name": "P F", "contact_id": null, "created_by": null, "updated_by": null, "date_created": "2013-02-01T00:54:51.337000+00:00", "date_updated": "2013-02-01T00:54:51.337000+00:00"}, {"id": "oppo_klajsdflf8FMy6GsNHEy84f7uoeEWv55slvUjKQZpJt", "organization_id": "orga_bwwWG475zqWiQGur0thQshwVXo8rIYecQHDWFanqhen", "lead_id": "lead_IIDHIStmFcFQZZP0BRe99V1MCoXWz2PGCm6EDmR9v2O", "lead_name": "Wayne Enterprises (Sample Lead)", "status_id": "stat_4ZdiZqcSIkoGVnNOyxiEY58eTGQmFNG3LPlEVQ4V7Nk", "status_label": "Active", "status_type": "active", "value": 5000, "value_period": "monthly", "value_formatted": "$50 monthly", "value_currency": "USD", "date_won": null, "confidence": 75, "note": "Bat Cave monthly maintenance cost", "user_id": "user_scOgjLAQD6aBSJYBVhIeNr6FJDp8iDTug8Mv6VqYoFn", "user_name": "P F", "contact_id": null, "created_by": null, "updated_by": null, "date_created": "2013-02-01T00:54:51.337000+00:00", "date_updated": "2013-02-01T00:54:51.337000+00:00"}], "updated_by": "user_04EJPREurd0b3KDozVFqXSRbt2uBjw3QfeYa7ZaGTwI", "date_created": "2013-02-01T00:54:51.333000+00:00", "id": "lead_IIDHIStmFcFQZZP0BRe99V1MCoXWz2PGCm6EDmR9v2O", "name": "Wayne Enterprises (Sample Lead)"}]}';
  }

};