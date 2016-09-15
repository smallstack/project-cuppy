/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/login")
    .setIndex(5)
    .setIcon("fa fa-user")
    .setLabel("navigation.login")
    .setRequiresAuthentication(false)
    .setTemplateUrl("client/views/login/login.ng.html")
    .setVisible(true)
    .setStateName("website.login")
    .setType("main")
);