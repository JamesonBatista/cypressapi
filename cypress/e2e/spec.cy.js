import { Requests } from "../support/Requests";

const req = new Requests();

describe("Requisition get our post in api", function () {
  it("Request in api reqres.in", function () {
    req
      .request({ endpoint: req.environment().endpoint_reqres })
      .get({ path: "status", equal: 200 })
      .get({ path: "last_name", equal: "Weaver" });
  });

  it("Request in api mockable.io", function () {
    req
      .request({
        endpoint: req.environment().endpoint_mockable,
        alias: "mockable",
      })
      .get({ alias: "mockable", path: "status", equal: 200 })
      .get({ alias: "mockable", path: "age", equal: 23 })
      .get({ alias: "mockable", path: "path_final" })
      .get({ alias: "mockable", path: "value" });
  });

  it("Request in api reqres.in POST", function () {
    req
      .request({
        method: "POST",
        endpoint: req.environment().endpoint_reqres,
        payload: "{}",
      })
      .get({ path: "id" })
      .get({ path: "createdAt" });
  });

  it("Requests in apis", function () {
    req
      .request({
        method: "POST",
        endpoint: req.environment().endpoint_reqres,
        payload: "{}",
      })
      .get({ path: "id" });
  });
});
