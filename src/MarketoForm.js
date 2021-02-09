import { useState, useEffect } from "react";

function appendForms2(baseUrl, setForms2Loaded) {
    if (window.MktoForms2) return setForms2Loaded(true);
  
    const script = document.createElement("script");
    script.src = `${baseUrl}/js/forms2/js/forms2.min.js`;
    script.onload = () => (window.MktoForms2 ? setForms2Loaded(true) : null);
    document.body.appendChild(script);
}

const MarketoForm = ({ baseUrl, munchkinId, formId  }) => {
    const [forms2Loaded, setForms2Loaded] = useState(false);

    var mktoLanguages = [
      {
         lang: "en",
         fields: [
            {
               Name: "FirstName",
               InputLabel: "First Name:"
            },
            {
               Name: "Phone",
               InputLabel: "Phone Number:",
               FieldMask: "999-999-9999"
            }
         ]
      },
      {
         lang: "fr",
         fields: [
            {
               Name: "FirstName",
               InputLabel: "Prénom:"
            },
            {
               Name: "Phone",
               InputLabel: "Numéro de téléphone:",
               FieldMask: "09 99 99 99 99"
            }
         ]
      }
   ];
   
  function translateMktoForm(descriptor, xlateLangs, session) {
  
    xlateLangs
      .find(function(language) {
        return language.lang == session.lang;
      })
      .fields.forEach(function(xlateField) {
        descriptor.rows.forEach(function(templateRow) {
          templateRow
            .filter(function(templateField) {
              return templateField.Name == xlateField.Name;
            })
            .forEach(function(templateField) {
              Object.assign(templateField, xlateField);
            });
        });
      });
  
    return descriptor;
  }

    function loadMktoFormSync(descriptor) {
      if(forms2Loaded) {
        window.MktoForms2.setOptions({
          rootUrl: baseUrl,
          baseUrl:baseUrl + "/js/forms2/",
          formSubmitPath: baseUrl + "/index.php/leadCapture/save2"
       });
    
       descriptor.action = "/index.php/leadCapture/save";
       descriptor = translateMktoForm(descriptor, mktoLanguages, { lang: "fr" } );
       
       window.MktoForms2.newForm(descriptor, function(form) {
          form.addHiddenFields({ munchkinId: munchkinId });
          form.render();
          form.getFormElem()[0].setAttribute("data-mkto-ready", "true");
       });
      }
      console.log(descriptor);
    }

    window.loadMktoFormSync = loadMktoFormSync;
  
    useEffect(() => {
      if (forms2Loaded) {
        const script = document.createElement("script");
        script.src = `${baseUrl}/index.php/form/getForm?munchkinId=${munchkinId}&form=${formId}&url=https%3A%2F%2Fwww.example.com%2Fpagename.html&callback=loadMktoFormSync`;
        script.onload = () => (window.MktoForms2 ? setForms2Loaded(true) : null);
        document.body.appendChild(script);
        return;
      }
      appendForms2(baseUrl, setForms2Loaded);
    }, [forms2Loaded, baseUrl, munchkinId, formId ]);
    return (
        <div className="formWrapper">
            <form id={"mktoForm_" + formId} className="mktoForm"></form>
        </div>
    )
}

export default MarketoForm;