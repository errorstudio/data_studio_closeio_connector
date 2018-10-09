class Lead {
  id:any;
  name:any;
  contacts:any;
  status:any;

  constructor(attrs) {
    this.id = attrs.id;
    this.name = attrs.display_name;
    this.contacts = attrs.contacts.map((c) => {return new Contact(c)});
    this.status = attrs.status_label;
  }

  webContacts(){
    return this.contacts.filter((c) => c.emailsByType('other').length)
  }
}