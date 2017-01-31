/// <reference path="../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRequiresAuthentication(true)
    .setStateName("backoffice.cuppy")
    .setType("backoffice")
    .setIcon("fa fa-futbol-o")
    .setLabel("Cuppy")
    .setRequiredRole("backoffice.manage")
    .setIndex(1)
    .setAbstract(true)
);