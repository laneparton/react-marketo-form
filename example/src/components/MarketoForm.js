import React, { useState, useEffect, useRef } from "react";

import PropTypes from 'prop-types';

function appendForms2(baseUrl, setForms2Loaded) {
    if (window.MktoForms2) return setForms2Loaded(true);
  
    const script = document.createElement("script");
    script.src = `${baseUrl}/js/forms2/js/forms2.min.js`;
    script.onload = () => (window.MktoForms2 ? setForms2Loaded(true) : null);
    document.body.appendChild(script);
}

const MarketoForm = ({ baseUrl, munchkinId, formId, descriptorCallback, whenRendered, onValidate, onSubmit, onSuccess  }) => {
    const [forms2Loaded, setForms2Loaded] = useState(false);
    const [formDescriptor, setFormDescriptor] = useState(undefined);
    const [formDescriptorLoaded, setFormDescriptorLoaded] = useState(false);
    const [formReady, setFormReady] = useState(false);

    function loadMktoFormSync(descriptor) {
      descriptor.action = "/index.php/leadCapture/save";
      if (forms2Loaded) {
        setFormDescriptor(descriptor);
      }
    }

    window.loadMktoFormSync = loadMktoFormSync;

    function setupForm(descriptor) {
      if(forms2Loaded) {
        window.MktoForms2.setOptions({
          rootUrl: baseUrl,
          baseUrl:baseUrl + "/js/forms2/",
          formSubmitPath: baseUrl + "/index.php/leadCapture/save2"
       });
           
       window.MktoForms2.newForm(descriptor, function(form) {
          form.addHiddenFields({ munchkinId: munchkinId });
          form.render();
          form.getFormElem()[0].setAttribute("data-mkto-ready", "true");
       });

       if(whenRendered) {
        window.MktoForms2.whenRendered(function(form) {
          whenRendered(form);
        });
       }
      }
    }

    useEffect(async () => {
      if (formDescriptorLoaded) {
        await descriptorCallback(formDescriptor);
        setupForm(formDescriptor);
      }
    }, [formDescriptor, descriptorCallback])

    useEffect(() => {
      if (forms2Loaded) {
        const script = document.createElement("script");
        script.src = `${baseUrl}/index.php/form/getForm?munchkinId=${munchkinId}&form=${formId}&url=https%3A%2F%2Fwww.example.com%2Fpagename.html&callback=loadMktoFormSync`;
        script.onload = () => (window.MktoForms2 ? setForms2Loaded(true) : null);
        document.body.appendChild(script);
        setFormDescriptorLoaded(true);
        return;
      }
      appendForms2(baseUrl, setForms2Loaded);
    }, [forms2Loaded, baseUrl, munchkinId, formId ]);

    return (
        <div className="embedded-marketo-form">
            <form id={"mktoForm_" + formId} className="mktoForm"></form>
        </div>
    )
}

MarketoForm.propTypes = {
    baseUrl: PropTypes.string,
    munchkinId: PropTypes.string,
    formId: PropTypes.string,
    descriptorCallback: PropTypes.func,
    whenRendered: PropTypes.func,
    onValidate: PropTypes.func,
    onSubmit: PropTypes.func,
    onSuccess: PropTypes.func
}

export default MarketoForm;