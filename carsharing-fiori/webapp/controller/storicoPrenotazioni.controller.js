sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "./View1.controller",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,view1,MessageBox) {
        "use strict";
        return Controller.extend("carsharingfiori.controller.storicoPrenotazioni", {
            onInit: function () {
            },

            onEditRecord: function (oEvent) {
                sap.ui.getCore().oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "carsharingfiori.fragment.modificaPrenotazione",
                        controller: this
                    });
                }
                var oBindingContext = oEvent.getSource().getParent().getBindingContext("RequestsModel");
                var statusPotential = oBindingContext.getProperty("status");
                if (statusPotential == "Rifiutata") {
                    sap.ui.getCore().sMessage = "Non è possibile effettuare la modifica perché la richiesta è stata rifiutata!";
                    MessageBox.error(sap.ui.getCore().sMessage);
                    return 0;
                }
                sap.ui.getCore().byId("inputIDReq").setValue(oBindingContext.getProperty("ID"));
                sap.ui.getCore().byId("inputStartDate").setValue(oBindingContext.getProperty("start_date"));
                sap.ui.getCore().byId("inputStartHour").setValue(oBindingContext.getProperty("start_hour"));
                sap.ui.getCore().byId("inputEndDate").setValue(oBindingContext.getProperty("end_date"));
                sap.ui.getCore().byId("inputEndHour").setValue(oBindingContext.getProperty("end_hour"));
                //  sap.ui.getCore().byId("inputTotHours").setValue(oBindingContext.getProperty("hours"));
                sap.ui.getCore().byId("inputLicensePlate").setValue(oBindingContext.getProperty("cars_license_plate"));
                this.pDialog.then(function (oDialog) {
                    oDialog.open();
                });


            },
            formatDate: function (date) {
                const separator = "-";
                var year = String(date.getFullYear());
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var day = String(date.getDate()).padStart(2, '0');
                return year.concat(separator).concat(month).concat(separator).concat(day);
            },
            onSaveRequest: function () {
                var that = this;
                var sIDRequest = sap.ui.getCore().byId("inputIDReq").getValue();
                var dDateStart = sap.ui.getCore().byId("inputStartDate").getDateValue();
                var sHourStart = sap.ui.getCore().byId("inputStartHour").getDateValue();
                var dDateEnd = sap.ui.getCore().byId("inputEndDate").getDateValue();
                var sHourEnd = sap.ui.getCore().byId("inputEndHour").getDateValue();
                //var sLicensePlate = sap.ui.getCore().byId("inputLicensePlate").getValue();
                var differencesTime = (dDateEnd.getTime() - dDateStart.getTime()) + (sHourEnd.getTime() - sHourStart.getTime());
                var seconds = Math.floor(differencesTime / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var sDateStart = this.formatDate(dDateStart);
                var sDateEnd = this.formatDate(dDateEnd);
                var ssHourStart = sap.ui.getCore().byId("inputStartHour").getValue() + ":00";
                var ssHourEnd = sap.ui.getCore().byId("inputEndHour").getValue() + ":00";
                var newRecord = {
                    start_date: sDateStart,
                    end_date: sDateEnd,
                    start_hours: ssHourStart,
                    end_hours: ssHourEnd,
                    status: "Inviato",
                    hours: hours
                };
                var sType = "PATCH";
                var sUrl = "/odata/v4/CarSharingService/Requests(ID=" + sIDRequest + ")";
                sap.ui.getCore().sMessage = "Prenotazione modificata con successo!";
                var aData = jQuery.ajax({
                    type: sType,
                    contentType: "application/json",
                    url: sUrl,
                    data: JSON.stringify(newRecord),
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        MessageBox.success(sap.ui.getCore().sMessage);
                        sap.ui.getCore().byId("EditRequest").close();

                        //that.getRequestsDb();
                    },
                    error: function (error) {
                        var e = error;
                        console.log(e);
                    }
                });
            },
            onCloseDialog: function () {

                sap.ui.getCore().byId("EditRequest").close();
            },
            onDeleteRecord: function (oEvent) {

                var that = this;
                var sKey;
                var sType;
                var sUrl;

                sap.ui.getCore().ButtonPressed = oEvent.getSource().getTooltip("");
                if (sap.ui.getCore().ButtonPressed == "Delete") {
                    sap.ui.getCore().sMessage = "Prenotazione cancellata con successo";
                    var letturaModello = oEvent.getSource().getParent().getBindingContext("RequestsModel");
                    sKey = letturaModello.getProperty("ID");
                    sType = "DELETE";
                    sUrl = "/odata/v4/CarSharingService/Requests(ID=" + sKey + ")";
                }
                var aData = jQuery.ajax({
                    type: sType,
                    contentType: "application/json",
                    url: sUrl,
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        MessageBox.success(sap.ui.getCore().sMessage);
                        //  that.onClear();
                        //  if (sap.ui.getCore().ButtonPressed !== "Delete") {
                        //      sap.ui.getCore().byId("helloDialog").close();
                        //  }
                        that.getRequestsDb();

                    },
                    error: function (error) {
                        var e = error;
                    }
                });

            },

            oBindingContex: function (oEvent) {
                return oEvent.getSource().getParent().getBindingContext("RequestsModel");
            },
            onAcceptRecord: function (oEvent) {

                var oBindingContext = this.oBindingContex(oEvent);
                var idRequest = oBindingContext.getProperty("ID");
                var newRecord = {
                    status: "Accettata"
                };
                var aData = jQuery.ajax({
                    type: "PATCH",
                    contentType: "application/json",
                    url: "/odata/v4/CarSharingService/Requests(ID=" + idRequest + ")",
                    data: JSON.stringify(newRecord),
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        sap.ui.getCore().sMessage = "Prenotazione approvata!";
                        MessageBox.success(sap.ui.getCore().sMessage);
                    },
                    error: function (error) {
                        var e = error;
                        console.log(e);
                    }
                });
            },
            onDeclineRecord: function (oEvent) {
                var oBindingContext = this.oBindingContex(oEvent)
                var idRequest = oBindingContext.getProperty("ID");
                var newRecord = {
                    status: "Rifiutata"
                };
                var aData = jQuery.ajax({
                    type: "PATCH",
                    contentType: "application/json",
                    url: "/odata/v4/CarSharingService/Requests(ID=" + idRequest + ")",
                    data: JSON.stringify(newRecord),
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                        sap.ui.getCore().sMessage = "Prenotazione rifiutata!";
                        MessageBox.success(sap.ui.getCore().sMessage);
                    },
                    error: function (error) {
                        var e = error;
                        console.log(e);
                    }
                });
            }


        });
    });