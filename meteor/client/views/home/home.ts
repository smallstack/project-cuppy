/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setRoute("/home")
	.setIndex(1)
	.setLabel("Home")
	.setLabel("navigation.home")
	.setIcon("fa fa-home")
	.setRequiresAuthentication(false)
	.setTemplateUrl("client/views/home/home.ng.html")
	.setVisible(true)
    .setStateName("website.home")
	.setType("main")
	.setDefaultRoute(true)
);