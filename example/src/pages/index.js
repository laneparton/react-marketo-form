import * as React from "react"

import MarketoForm from "../components/MarketoForm"
import Layout from "../components/layout"
import SEO from "../components/seo"

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

function destyleMktoForm(mktoForm, moreStyles){
	var formEl = mktoForm.getFormElem()[0],
		arrayify = getSelection.call.bind([].slice);

	// remove element styles from <form> and children
	var styledEls = arrayify(formEl.querySelectorAll("[style]")).concat(formEl);	
	styledEls.forEach(function(el) {
		el.removeAttribute("style");
	});

	// disable remote stylesheets and local <style>s
	var styleSheets = arrayify(document.styleSheets);	
	styleSheets.forEach(function(ss) {
		if ( [window.mktoForms2BaseStyle,window.mktoForms2ThemeStyle].indexOf(ss.ownerNode) != -1 || formEl.contains(ss.ownerNode) ) {
			ss.disabled = true;
		}
	});
         
   if(!moreStyles) {
      formEl.setAttribute("data-styles-ready", "true");
      console.log("Styles ready at: " + performance.now())
   }
};

const IndexPage = () => {
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

  return (
    <Layout>
      <SEO title="Home" />
      <MarketoForm
        baseUrl="//go.sensus.com"
        munchkinId="306-CJR-109"
        formId="2203"
        descriptorCallback={(descriptor) => {
          translateMktoForm(descriptor, mktoLanguages, { lang: "fr" } );
        }}
        whenRendered={(form) => {
          destyleMktoForm(form);
        }}
      />
    </Layout>
  )
}

export default IndexPage
