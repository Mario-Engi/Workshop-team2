sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "./View1.controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,view1) {
        "use strict";
        return Controller.extend("carsharingfiori.controller.storicoPrenotazioni", {
            onInit: function () {
            },

            oBindingContex: function(oEven){
                return oEven.getSource().getParent().getBindingContext("RequestsModel");
            },


            onAcceptRecord: function(oEvent) {
               var oBindingContext = this.oBindingContex(oEvent)
               this.oOriginController = view1;
              var idRequest = oBindingContext.getProperty("ID");
              var newRecord = {
                status: "Accetta"                
            };

            //this.oOriginController.getRequestsDB("");
                var aData = jQuery.ajax({
                    type: "PATCH",
                    contentType: "application/json",
                    url: "/odata/v4/CarSharingService/Requests(ID=" + idRequest + ")",
                    data: JSON.stringify(newRecord),
                    dataType: "json",
                    async: false,
                    success: function (data, textStatus, jqXHR) {
                       // MessageBox.success(sap.ui.getCore().sMessage);
                       

                    },
                    error: function (error) {
                        var e = error;
                        console.log(e);

                    }
                });


            }


        });
    });