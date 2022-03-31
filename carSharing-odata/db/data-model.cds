namespace carSharing.odata;
using { managed, cuid } from '@sap/cds/common';



entity Cars: managed,  {
  // campi
  key license_plate: String(7);
  brand: String(50) @mandatory not null;
  available: String; 
  model: String;
  hours_tot: Integer;
  
  // associazione
 @cascade: { update, insert, delete}
      requests: Association to many Requests on requests.cars = $self; 
}

entity Profiles : managed  {
  // campi
  key badge: Integer;
  name  : String @mandatory not null;
  surname: String @mandatory not null;
  age  : Integer not null;
  telephon: Integer; 
  license:  String @mandatory not null; 
  // associazioni
  @cascade: { update, insert, delete }
      requests: Association to many Requests on requests.profiles = $self; 

}
entity Requests : managed {
    // campi
    key ID: Integer; 
    start_date  : Date @mandatory not null;
    end_date    : Date  @mandatory not null;
    status : String @mandatory not null; 
    hours: Integer;
     // associazione
      cars: Association to Cars;
      profiles: Association to Profiles;
}