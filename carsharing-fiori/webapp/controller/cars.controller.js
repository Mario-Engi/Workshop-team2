sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "./View1.controller"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, MessageBox, View1) {
        "use strict";

        return Controller.extend("carsharingfiori.controller.cars", {
            onInit: function () {

            },

            onAddRecordRequest: function (oEvent) {
                sap.ui.getCore().oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "carsharingfiori.fragment.BookingNew",
                        controller: this
                    });
                }
                var oBindingContext = oEvent.getSource().getParent().getBindingContext("CarsModel");
                 sap.ui.getCore().byId("inputBrand").setValue(oBindingContext.getProperty("brand"));   
                 sap.ui.getCore().byId("inputModel").setValue(oBindingContext.getProperty("model"));              
                 sap.ui.getCore().byId("inputLicensePlate").setValue(oBindingContext.getProperty("license_plate"));
               
                this.pDialog.then(function (oDialog) {
                 
                    oDialog.open();
                });

            },

            onCloseDialog: function () {
                sap.ui.getCore().byId("NewBooking").close();
            },
            
           
            onNewRequest: function () {
                var that = this;
                var sLicensePlate = sap.ui.getCore().byId("inputLicensePlate").getValue();
                var sBadget = Number(sap.ui.getCore().byId("inputBadge").getValue());
                if(sBadget==0){
                    sap.ui.getCore().sMessage = "Matricola obbligatoria ";
                    MessageBox.error(sap.ui.getCore().sMessage);
                    return 0;
                }
                var dDateStart = sap.ui.getCore().byId("inputDateStart").getDateValue();
                if(dDateStart == null){
                    sap.ui.getCore().sMessage = "Data di partenza obbligatoria ";
                    MessageBox.error(sap.ui.getCore().sMessage);
                    return 0;
                }
                var dDateEnd = sap.ui.getCore().byId("inputDateEnd").getDateValue();
                if(dDateEnd == null){
                    sap.ui.getCore().sMessage = "Data di fine obbligatoria ";
                    MessageBox.error(sap.ui.getCore().sMessage);
                    return 0;
                }
                var dHourStart = sap.ui.getCore().byId("hourStart").getDateValue();
                if(dHourStart == null){
                    sap.ui.getCore().sMessage = "Ora di partenza obbligatoria ";
                    MessageBox.error(sap.ui.getCore().sMessage);
                    return 0;
                }
                var dHourEnd = sap.ui.getCore().byId("hourEnd").getDateValue();
                if(dHourEnd == null){
                    sap.ui.getCore().sMessage = "Ora di fine obbligatoria ";
                    MessageBox.error(sap.ui.getCore().sMessage);
                    return 0;
                }
               
                
                var sHourStart= sap.ui.getCore().byId("hourStart").getValue() + ":00";
                var sHourEnd = sap.ui.getCore().byId("hourEnd").getValue() + ":00";


                var differencesTime = (dDateEnd.getTime() - dDateStart.getTime()) + (dHourEnd.getTime() - dHourStart.getTime());
                var seconds = Math.floor(differencesTime / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var sDateStart = this.formatDate(dDateStart);
                var sDateEnd = this.formatDate(dDateEnd);
                this.prova(sDateStart,sDateEnd)

                // var filter="?$filter=start_date ge '" + sDateStart + "' and start_end <= '" + sDateEnd + "' and cars_license_plate eq '" + sLicensePlate + "'";
                // var oMdl = new sap.ui.model.json.JSONModel(); 
                // var that = this;
                // var aData = jQuery.ajax({
                //     type: "GET",
                //     contentType: "application/json",
                //     url: "/odata/v4/CarSharingService/Requests" + filter,
                //     dataType: "json",
                //     async: false,
                //     success: function (data, textStatus, jqXHR) {
                //         oMdl.setData(data.value);
                //     },
                //     error: function (error) {
                //         var e = error;
                //     }

                // });

                var newRecord = {
                    start_date: sDateStart,//"2022-04-01",
                    end_date: sDateEnd,//"2022-04-02",
                    status: "Inviato",
                    start_hours: sHourStart,
                    end_hours: sHourEnd,
                    hours: hours,
                    cars_license_plate: sLicensePlate,
                    profiles_badge: sBadget
                };

                var sType = "POST";
                var sUrl = "/odata/v4/CarSharingService/Requests";
                sap.ui.getCore().sMessage = "Nuova Registrazione inviata ";

                var aData = jQuery.ajax({
                    type: sType,
                    contentType: "application/json",
                    url: sUrl,
                    data: JSON.stringify(newRecord),
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        MessageBox.success(sap.ui.getCore().sMessage);
                        sap.ui.getCore().byId("NewBooking").close();
                        that.onClear();
                       // View1.getRequestsDB();

                    },
                    error: function (error) {
                        var e = error;
                        console.log(e);

                    }
                });
            },

            formatDate: function (date) {

                const separator = "-";
                var year = String(date.getFullYear());
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var day = String(date.getDate()).padStart(2, '0');
                return year.concat(separator).concat(month).concat(separator).concat(day);
                

            },

            onClear: function () {
                var clearBadget = Number(sap.ui.getCore().byId("inputBadge").getValue());
                if(clearBadget !== 0){
                    sap.ui.getCore().byId("inputBadge").setValue(0);
                }
                var clearDateStart = sap.ui.getCore().byId("inputDateStart").getDateValue();
                if(clearDateStart !== null){
                    sap.ui.getCore().byId("inputDateStart").setValue(null);
                }
               
                var clearDateEnd = sap.ui.getCore().byId("inputDateEnd").getDateValue();
                if(clearDateEnd !== null){
                    sap.ui.getCore().byId("inputDateEnd").setValue(null);
                }
                var clearHourStart = sap.ui.getCore().byId("hourStart").getDateValue();
                if(clearHourStart !== null){
                    sap.ui.getCore().byId("hourStart").setValue(null);
                }
                var clearHourEnd = sap.ui.getCore().byId("hourEnd").getDateValue();
                if(clearHourEnd !== null){
                    sap.ui.getCore().byId("hourEnd").setValue(null);
                }
                
            },

            onDeleteRecordCars : function(oEvent){
                var that=this;
                var sKey;
                var sType;
                var sUrl;
                //sap.ui.getCore().ButtonPressed = oEvent.getSource().getTooltip("");
                //if (sap.ui.getCore().ButtonPressed == "Delete") {
                    sap.ui.getCore().sMessage = "La vettura e stata cancellata correttamente ";
                    var letturaModello = oEvent.getSource().getParent().getBindingContext("CarsModel");
                    sKey = letturaModello.getProperty("license_plate");
                    // this.getOwnerComponent().getModel("RequestsModel").getData().ID;
                    sType = "DELETE";
                    sUrl = "/odata/v4/CarSharingService/Cars(license_plate='" + sKey + "')";
               // }
                var aData = jQuery.ajax({
                    type: sType,
                    contentType: "application/json",
                    url: sUrl,
                   // data: JSON.stringify(newRecord),
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        MessageBox.success(sap.ui.getCore().sMessage);
                        //that.getRequestsDb();
                    },
                    error: function (error) {
                        var e = error;
                    }
                });
        },

        // prova: function(inizioData,fineData){
        //     var oMdl = new sap.ui.model.json.JSONModel(); 
        //     var that = this;
        //     var aData = jQuery.ajax({
        //         type: "GET",
        //         contentType: "application/json",
        //         url: "/odata/v4/CarSharingService/Requests",
        //         dataType: "json",
        //         async: false,
        //         success: function (data, textStatus, jqXHR) {
        //             oMdl.setData(data.value);
        //         },
        //           error: function (error) {
        //             var e = error;
        //         }
        //     });
        //     var oggi = new Date();
        //     var elemen = 0;
        //      var fineData = new Date("04/05/2022");
        //      var inizioData = new Date("04/03/2022");
        //      var dayMilli = 1000 * 60 * 60 *24
        //     var dataDifferenza = (fineData - inizioData)/dayMilli;
        //     for (let index = 0; index < dataDifferenza  ; index++) {
        //         for (let index = 0; index <= oMdl.oData.length; index++) {
        //             var XS = oMdl.oData[index].start_date;
        //             var XE = oMdl.oData[index].end_date;
    
                    
        //         }
                
        //     }
            
        //     var oml = oMdl.oData['0'].start_date;
        //     //this.getOwnerComponent().setModel(oMdl, "RequestsModel");
    
        // },




        });
    })