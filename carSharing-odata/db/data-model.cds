namespace carSharing.odata;
using { managed, cuid } from '@sap/cds/common';



entity Cars: managed, cuid {
  // campi
  brand: String(50) @mandatory not null;
  license_plate: String(7);
  available: Boolean; 
  
  // associazione
 @cascade: { update, insert, delete}
      requests: Association to many Requests on requests.cars = $self; 
}

entity Profiles : managed, cuid  {
  // campi
  name  : String @mandatory not null;
  surname: String @mandatory not null;
  age  : Integer not null;
  telephon: Integer; 
  license:  String @mandatory not null; 
  // associazioni
  @cascade: { update, insert, delete }
      requests: Association to many Requests on requests.profiles = $self; 

}
entity Requests : managed, cuid {
    // campi
    
    start_date  : Date @mandatory not null;
    end_date    : Date  @mandatory not null;
    status : String @mandatory @assert.range enum { Cancelled; Sent; Approved; };
    hours: Integer;
     // associazione
      cars: Association to Cars;
      profiles: Association to Profiles;
}