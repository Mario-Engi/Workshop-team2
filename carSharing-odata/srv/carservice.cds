using carSharing.odata as db from '../db/data-model';

service CarSharingService {
    entity Cars     as projection on db.Cars;
    entity Profiles as projection on db.Profiles;
    entity Requests as projection on db.Requests;

    // access control restrictions

    annotate Cars with @restrict : [

    {
        grant : 'READ',
        to    : 'any'
    },
     {
        grant : 'CREATE',
        to : 'supervisor'

    },
    


    {
        grant : 'UPDATE',
        to : 'any'
    },
    {
        grant : 'DELETE',
        to : 'supervisor'
    }
    ];
    annotate Requests with @restrict : [
    {
        grant : 'READ',
        to    : 'any'
    },
     {
        grant : 'CREATE',
        to : 'client'
    },
    {
        grant : 'UPDATE',
        to : 'any'
    },
    {
        grant : 'DELETE',
        to : 'any'
    }
    ];
    annotate Profiles with @restrict : [
    {
        grant : 'READ',
        to    : 'any'
    },
     {
        grant : 'CREATE',
        to : 'client'
    },
    {
        grant : 'UPDATE',
        to : 'client'
    },
    {
        grant : 'DELETE',
        to : 'client'
    }
    ]
}

