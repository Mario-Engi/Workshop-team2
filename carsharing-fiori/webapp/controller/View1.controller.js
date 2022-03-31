sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "./cars.controller",
    "sap/ui/core/Fragment",
    "./storicoPrenotazioni.controller"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,cars,Fragment,storicoPrenotazioni) {
        "use strict";

        return Controller.extend("carsharingfiori.controller.View1", {
            
            onInit: function () {
               this.getCarsDB("");
               this.getRequestsDB("");
            },

            onAfterRendering: function () {
                var oFrtController = new cars(this.getView(), this);
                var Fragment = sap.ui.xmlfragment("carsharingfiori.fragment.cars", oFrtController); 
                this.getView().byId("TabCars").addContent(Fragment); 
                
                var oFrtControllerReq = new storicoPrenotazioni(this.getView(), this);
                var FragmentReq = sap.ui.xmlfragment("carsharingfiori.fragment.storicoPrenotazioni", oFrtControllerReq); 
                this.getView().byId("TabRequest").addContent(FragmentReq); 
            },
         
            getCarsDB: function(filter){
                var oMdl = new sap.ui.model.json.JSONModel(); 
                var that = this;
                var aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/odata/v4/CarSharingService/Cars"+ filter,
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        oMdl.setData(data.value);
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdl, "CarsModel");
        
            },
            onSearchFilter: function () {
                var filter; //sap.ui.getCore().filter
                var b=0,m=0,a=0;
                var sBrand = this.getView().byId("Brand").getValue();
                var sModel = this.getView().byId("Model").getValue();
                var sAvailable = this.getView().byId("Available").getSelectedItem().getKey();
                if (sBrand && !sModel && !sAvailable) {
                     filter = "?$filter=brand eq '" + sBrand + "'";
                }else if(sBrand && sModel && !sAvailable){
                    filter = "?$filter=brand eq '" + sBrand + "' and model eq '" + sModel + "'";
                }else if(sBrand && sModel && sAvailable){
                        filter = "?$filter=brand eq '" + sBrand + "' and model eq '" + sModel + "' and available eq '" + sAvailable + "'" ;
                }else if(!sBrand && sModel && sAvailable){
                    filter = "?$filter=model eq '" + sModel + "' and available eq '" + sAvailable + "'" ;
                }else if(!sBrand && !sModel && sAvailable){
                filter = "?$filter=available eq '" + sAvailable + "'" ;
                } else if(!sBrand && sModel && !sAvailable){
                    filter = "?$filter=model eq '" + sModel + "'" ;
                 }else if(sBrand && !sModel && !sAvailable){
                    filter = "?$filter=brand eq '" + sBrand + "' and available eq '" + sAvailable + "'";
                        } else {
                    filter = ""; 
                }

        
                this.getCarsDB(filter);  //??
            },

            getRequestsDB: function(filter){
                var oMdl = new sap.ui.model.json.JSONModel(); 
                var that = this;
                var aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/odata/v4/CarSharingService/Requests" + filter,
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        oMdl.setData(data.value);
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
                this.getOwnerComponent().setModel(oMdl, "RequestsModel");
        
            },
            onSearchFilterReq: function () {
                var filterReq;
                var sEmpID = this.getView().byId("EmpID").getValue();
                var sReqID = this.getView().byId("ReqID").getValue();
                if (sEmpID && !sReqID) {
                    filterReq = "?$filter=profiles_ID eq '" + sEmpID + "'";
               }else if(!sEmpID && sReqID){
                   filterReq = "?$filter=ID eq '" + sReqID + "'";
               }else if(sEmpID && sReqID){
                       filterReq = "?$filter=profiles_ID eq '" + sEmpID + "' and ID eq '" + sReqID + "'";
               }
               else {
                   filterReq = "";
               }
        
                this.getRequestsDB(filterReq);
            }
             /*onAddRecord: function () {
                var oFrtController = new newBooking(this.getView(), this);
                sap.ui.getCore().oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "carsharingfiori.fragment.newBooking",
                        oFrtController
                    });
                }
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });
                
            },*/
        });
    });
