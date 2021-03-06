// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    "library": {
      "identifier": {
        "id": "BreastCancer",
        "version": "1.0.0"
      },
      "schemaIdentifier": {
        "id": "urn:hl7-org:elm",
        "version": "r1"
      },
      "usings": {
        "def": [
          {
            "localIdentifier": "System",
            "uri": "urn:hl7-org:elm-types:r1"
          }, {
            "localIdentifier": "FHIR",
            "uri": "http://hl7.org/fhir",
            "version": "1.0.2"
          }
        ]
      },
      "includes": {
        "def": [
          {
            "localIdentifier": "FHIRHelpers",
            "path": "FHIRHelpers",
            "version": "1.0.2"
          }
        ]
      },
      "codeSystems": {
        "def": [
          {
            "name": "SNOMEDCT",
            "id": "http://snomed.info/sct",
            "accessLevel": "Public"
          }
        ]
      },
      "valueSets": {
        "def": [
          {
            "name": "Breast Cancer",
            "id": "2.16.840.1.113883.3.526.2.98",
            "accessLevel": "Public"
          }
        ]
      },
      "statements": {
        "def": [
          {
            "name": "Patient",
            "context": "Patient",
            "expression": {
              "type": "SingletonFrom",
              "operand": {
                "dataType": "{http://hl7.org/fhir}Patient",
                "type": "Retrieve"
              }
            }
          }, {
            "name": "InDemographic",
            "context": "Patient",
            "accessLevel": "Public",
            "expression": {
              "type": "And",
              "operand": [
                {
                  "type": "GreaterOrEqual",
                  "operand": [
                    {
                      "precision": "Year",
                      "type": "CalculateAge",
                      "operand": {
                        "path": "birthDate.value",
                        "type": "Property",
                        "source": {
                          "name": "Patient",
                          "type": "ExpressionRef"
                        }
                      }
                    }, {
                      "valueType": "{urn:hl7-org:elm-types:r1}Integer",
                      "value": "18",
                      "type": "Literal"
                    }
                  ]
                }, {
                  "type": "LessOrEqual",
                  "operand": [
                    {
                      "precision": "Year",
                      "type": "CalculateAge",
                      "operand": {
                        "path": "birthDate.value",
                        "type": "Property",
                        "source": {
                          "name": "Patient",
                          "type": "ExpressionRef"
                        }
                      }
                    }, {
                      "valueType": "{urn:hl7-org:elm-types:r1}Integer",
                      "value": "75",
                      "type": "Literal"
                    }
                  ]
                }
              ]
            }
          }, {
            "name": "HasBreastCancer",
            "context": "Patient",
            "accessLevel": "Public",
            "expression": {
              "type": "Exists",
              "operand": {
                "type": "Query",
                "source": [
                  {
                    "alias": "C",
                    "expression": {
                      "dataType": "{http://hl7.org/fhir}Condition",
                      "codeProperty": "code",
                      "type": "Retrieve",
                      "codes": {
                        "name": "Breast Cancer",
                        "type": "ValueSetRef"
                      }
                    }
                  }
                ],
                "relationship": [],
                "where": {
                  "type": "Equal",
                  "operand": [
                    {
                      "path": "value",
                      "type": "Property",
                      "source": {
                        "path": "verificationStatus",
                        "scope": "C",
                        "type": "Property"
                      }
                    }, {
                      "valueType": "{urn:hl7-org:elm-types:r1}String",
                      "value": "confirmed",
                      "type": "Literal"
                    }
                  ]
                }
              }
            }
          }, {
            "name": "MeetsInclusionCriteria",
            "context": "Patient",
            "accessLevel": "Public",
            "expression": {
              "type": "And",
              "operand": [
                {
                  "name": "InDemographic",
                  "type": "ExpressionRef"
                }, {
                  "name": "HasBreastCancer",
                  "type": "ExpressionRef"
                }
              ]
            }
          }
        ]
      }
    }
  };

}).call(this);

//# sourceMappingURL=BreastCancer.js.map
