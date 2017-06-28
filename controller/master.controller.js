sap.ui.controller("sap.ui.movielist.controller.master", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf movielist.main
*/
	onInit: function() {

	},
	
	onSearch: function(oEvent) {
		
		// combine filters
		var filterTitle = new sap.ui.model.Filter("Title",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		var filterProducer = new sap.ui.model.Filter("Producer",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		var filterGenre = new sap.ui.model.Filter("Genre",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		var filterReleased = new sap.ui.model.Filter("Released",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		var filterDirector = new sap.ui.model.Filter("Director",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		var filterSummary = new sap.ui.model.Filter("Summary",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		var filterWriters = new sap.ui.model.Filter("Writers",sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));
		
		// apply
		this.getView().byId("masterList").getBinding("items").filter(new sap.ui.model.Filter(
				{filters:[filterTitle,
				          filterProducer,
				          filterGenre,
				          filterReleased,
				          filterDirector,
				          filterWriters,
				          filterSummary],
				 and:false})
		);
		  
	},
	
	_setDetailVisible: function() {
		// get detail page
		var detailPage = sap.ui.getCore().byId('movieList').getDetailPage("detailPage");
		// set visibility
		if (!detailPage.getVisible()) { detailPage.setVisible(true); }		
	},
	
	onAdd: function(oEvent) {
		// detail visible
		this._setDetailVisible();
		// fake binding context
		var detailPage = sap.ui.getCore().byId('movieList').getDetailPage("detailPage");	
		var oModel = sap.ui.getCore().getModel("movielist");
		oContext = new sap.ui.model.Context(oModel,"/MovieSet('NEW')");
		detailPage.setBindingContext(oContext,"movielist");
		// buttons
		detailPage.byId("buttonCreate").setVisible(true);
		detailPage.byId("buttonSave").setVisible(false);
		detailPage.byId("buttonEdit").setVisible(false);
		detailPage.byId("buttonDelete").setVisible(false);	
		detailPage.byId("PlaybillUploader").setVisible(true);
		// fields
		detailPage.byId("Title").setEditable(true);
		detailPage.byId("Genre").setEditable(true);
		detailPage.byId("Released").setEditable(true);
		detailPage.byId("Director").setEditable(true);
		detailPage.byId("Producer").setEditable(true);
		detailPage.byId("Writers").setEditable(true);
		detailPage.byId("Summary").setEditable(true);		
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
		sap.ui.getCore().byId('movieList').getDetailPage("detailPage").setVisible(false);
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf movielist.main
*/
	onExit: function() {

	},
	
	onMovieSelected: function(oEvent) {
		// detail visible
		this._setDetailVisible();
		// bind element to destination page
		var detailPage = sap.ui.getCore().byId('detailPage');
		detailPage.setBindingContext(oEvent.getSource().getBindingContext("movielist"),"movielist");
        // buttons
		detailPage.byId("buttonCreate").setVisible(false);
		detailPage.byId("buttonSave").setVisible(false);
		detailPage.byId("buttonEdit").setVisible(true);
		detailPage.byId("buttonDelete").setVisible(true);
		detailPage.byId("PlaybillUploader").setVisible(false);
		// fields
		detailPage.byId("Title").setEditable(false);
		detailPage.byId("Genre").setEditable(false);
		detailPage.byId("Released").setEditable(false);
		detailPage.byId("Director").setEditable(false);
		detailPage.byId("Producer").setEditable(false);
		detailPage.byId("Writers").setEditable(false);
		detailPage.byId("Summary").setEditable(false);
        // detail
		sap.ui.getCore().byId('movieList').toDetail("detailPage");
	}
});