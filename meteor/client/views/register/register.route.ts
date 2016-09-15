/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/register")
    .setIndex(10)
    .setIcon("fa fa-user")
    .setLabel("navigation.register")
    .setRequiresAuthentication(false)
    .setTemplateUrl("client/views/register/register.ng.html")
    .setVisible(true)
    .setStateName("website.register")
    .setType("main")
);