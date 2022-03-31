sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment) {
        "use strict";

        return Controller.extend("carsharingfiori.controller.cars", {
            onInit: function () {

            },


            /* onAddRecord: function () {
                sap.ui.getCore().oView = this.getView();
                if (!this.pDialog) {
                    this.pDialog = Fragment.load({
                        name: "carsharingfiori.fragment.newBooking",
                        controller: this
                    });
                }
                this.pDialog.then(function (oDialog) {
                    sap.ui.getCore().oView.addDependent(oDialog);
                    oDialog.open();
                });
                
            },*/

        });
    })