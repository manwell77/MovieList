sap.ui.controller("sap.ui.movielist.controller.detail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf movielist.main
*/  
	
	_toDisplay: function() {
		  this.getView().byId("buttonSave").setVisible(false);
		  this.getView().byId("buttonEdit").setVisible(true);
		  this.getView().byId("buttonDelete").setVisible(true);		
		  this.getView().byId("buttonCreate").setVisible(false);
		  this.getView().byId("PlaybillUploader").setVisible(false);
		  this.getView().byId("Title").setEditable(false);
		  this.getView().byId("Genre").setEditable(false);
		  this.getView().byId("Released").setEditable(false);
		  this.getView().byId("Director").setEditable(false);
		  this.getView().byId("Producer").setEditable(false);
		  this.getView().byId("Writers").setEditable(false);
		  this.getView().byId("Summary").setEditable(false);		
	},
	
	handleTypeMissmatch: function(oEvent) {
		sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("badFile"));
	},
	
	handleUploadComplete: function(oEvent) {
		// get file
		var file = this.getView().byId("PlaybillUploader").getFocusDomRef().files[0];
		// refrence to be used inside onloadene
		var self = this;
		// build reader and onload method
		var reader = new FileReader(); reader.onloadend = function(e) {     
			// get base64
			var base64 = btoa(e.target.result);
			// decide mime
			switch (file.name.split(".").pop()) {
				case "jpeg": base64 = "data:image/jpeg;base64," + base64; break;
				case "jpg": base64 = "data:image/jpg;base64," + base64; break;
				case "png": base64 = "data:image/png;base64," + base64; break;
				default: sap.m.MessageToast.show("File type not allowed!"); break;
			}
			// change image
			if (base64) { self.getView().byId("Playbill").setProperty("src",base64); }
		};
		// read input
		reader.readAsBinaryString(file);
	},
	
	_buildObject: function(movieID) {
		  // build Object
		  var oObject = {
		    MovieID: movieID, 
		    Title: this.getView().byId("Title").getValue(),	  
		    Genre: this.getView().byId("Genre").getValue(),
		    Released: this.getView().byId("Released").getValue(),
		    Director: this.getView().byId("Director").getValue(),
		    Producer: this.getView().byId("Producer").getValue(),
		    Writers: this.getView().byId("Writers").getValue(),
		    Summary: this.getView().byId("Summary").getValue(),
		    Playbill: this.getView().byId("Playbill").getSrc()
		  };
		  
		return oObject;
	},
	
	onCreate: function() {
	      //build object
		  var oObject = this._buildObject("");
		  // dummy image clean
		  if (oObject.Playbill==this.getView().getModel("i18n").getResourceBundle().getText("photoAdd")) { oObject.Playbill=""; }
		  // create
		  var oModel = sap.ui.getCore().getModel("movielist");
		  // myself
		  var self = this;
		  var oObject = oModel.create("/MovieSet", oObject,{context:null,
			  success:function(oData,response){
				  sap.m.MessageToast.show(self.getView().getModel("i18n").getResourceBundle().getText("movieCreationOK")); 
				  var detailPage = sap.ui.getCore().byId('detailPage');
				  detailPage.getController()._toDisplay();
				  var oModel = sap.ui.getCore().getModel("movielist");
				  var oContext = new sap.ui.model.Context(oModel,"/MovieSet('"+oData.MovieID+"')");
				  detailPage.setBindingContext(oContext,"movielist")
				  },
			  error:function(oError){
				  sap.m.MessageToast.show(self.getView().getModel("i18n").getResourceBundle().getText("movieCreationKO"));
				  }});
	},
	
	onSave: function() {
		  var oContext=this.getView().getBindingContext("movielist");
		  var oModel = sap.ui.getCore().getModel("movielist");
		  var oObject = this._buildObject(oContext.getObject().MovieID);
		  var self = this;
		  oModel.update(oContext.getPath(),oObject,{context:null,
			  success:function(oData,response){
				  sap.m.MessageToast.show(self.getView().getModel("i18n").getResourceBundle().getText("movieUpdateOK"));
				  var detailPage = sap.ui.getCore().byId('detailPage');
				  detailPage.getController()._toDisplay();				  
				  },
			  error:function(oError){
				  sap.m.MessageToast.show(self.getView().getModel("i18n").getResourceBundle().getText("movieUpdateKO"));
				  }});
	},
	
	onBack: function() {
		var visible = sap.ui.getCore().byId('movieList').getMasterPage("masterPage").getVisible();
		sap.ui.getCore().byId('movieList').toMaster("masterPage");
	},
	
	onDelete: function() {
		  var oContext=this.getView().getBindingContext("movielist");
		  var oModel = sap.ui.getCore().getModel("movielist");
		  var self = this;
		  oModel.remove(oContext.getPath(),{context:null,
			  success:function(oData,response){
				  sap.m.MessageToast.show(self.getView().getModel("i18n").getResourceBundle().getText("movieDeletionOK"));
				  sap.ui.getCore().byId('movieList').getDetailPage("detailPage").setVisible(false);
				  },
			  error:function(oError){
				  sap.m.MessageToast.show(self.getView().getModel("i18n").getResourceBundle().getText("movieDeletionKO"));
				  }});
	},
	
	onEdit: function() {
	  this.getView().byId("buttonSave").setVisible(true);
	  this.getView().byId("buttonEdit").setVisible(false);
	  this.getView().byId("buttonDelete").setVisible(false);
	  this.getView().byId("buttonCreate").setVisible(false);
	  this.getView().byId("PlaybillUploader").setVisible(true);
	  this.getView().byId("Title").setEditable(true);
	  this.getView().byId("Genre").setEditable(true);
	  this.getView().byId("Released").setEditable(true);
	  this.getView().byId("Director").setEditable(true);
	  this.getView().byId("Producer").setEditable(true);
	  this.getView().byId("Writers").setEditable(true);
	  this.getView().byId("Summary").setEditable(true);
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf movielist.main
*/
	onBeforeRendering: function() {

	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf movielist.main
*/
	onAfterRendering: function() {
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf movielist.main
*/
	onExit: function() {

	}

});