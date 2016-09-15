/// <reference path="../typedefinitions/generated.d.ts" />

var configurationService: ConfigurationService = smallstack.ioc.get<ConfigurationService>("configurationService");

configurationService.set("routing.default", "website.home");
configurationService.set("registration.success.redirect", "website.competitions");
configurationService.set("routing.authrequired", "website.login");