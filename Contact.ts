class Contact {
  name: any;
  email: any;
  emails: any;
  id: any;


  constructor(args) {
    this.name = args.name;
    this.emails = args.emails;
    this.id = args.id;
  }

  emailsByType(type) {
    return this.emails.filter((e) => {return e.type === type})
  }
}