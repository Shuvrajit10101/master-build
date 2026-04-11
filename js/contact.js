// ============================================================
// APEX AUTOMATIONS — Contact Page
// Task 5: Form + WhatsApp + Email Submission
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  // ── Animate hero ──
  gsap.from('.contact-hero', {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power2.out'
  });

  // ── Animate form ──
  gsap.from('.contact-form-wrapper', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out'
  });

  // ── Animate info cards ──
  gsap.utils.toArray('.info-card').forEach(function (card, i) {
    gsap.from(card, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.4 + i * 0.15,
      ease: 'power2.out'
    });
  });

  // ── Country + ISD Data ──
  var countries = [
    { name: "Afghanistan", code: "AF", isd: "+93" },
    { name: "Albania", code: "AL", isd: "+355" },
    { name: "Algeria", code: "DZ", isd: "+213" },
    { name: "Andorra", code: "AD", isd: "+376" },
    { name: "Angola", code: "AO", isd: "+244" },
    { name: "Argentina", code: "AR", isd: "+54" },
    { name: "Armenia", code: "AM", isd: "+374" },
    { name: "Australia", code: "AU", isd: "+61" },
    { name: "Austria", code: "AT", isd: "+43" },
    { name: "Azerbaijan", code: "AZ", isd: "+994" },
    { name: "Bahrain", code: "BH", isd: "+973" },
    { name: "Bangladesh", code: "BD", isd: "+880" },
    { name: "Belarus", code: "BY", isd: "+375" },
    { name: "Belgium", code: "BE", isd: "+32" },
    { name: "Belize", code: "BZ", isd: "+501" },
    { name: "Bhutan", code: "BT", isd: "+975" },
    { name: "Bolivia", code: "BO", isd: "+591" },
    { name: "Bosnia and Herzegovina", code: "BA", isd: "+387" },
    { name: "Botswana", code: "BW", isd: "+267" },
    { name: "Brazil", code: "BR", isd: "+55" },
    { name: "Brunei", code: "BN", isd: "+673" },
    { name: "Bulgaria", code: "BG", isd: "+359" },
    { name: "Cambodia", code: "KH", isd: "+855" },
    { name: "Cameroon", code: "CM", isd: "+237" },
    { name: "Canada", code: "CA", isd: "+1" },
    { name: "Chile", code: "CL", isd: "+56" },
    { name: "China", code: "CN", isd: "+86" },
    { name: "Colombia", code: "CO", isd: "+57" },
    { name: "Costa Rica", code: "CR", isd: "+506" },
    { name: "Croatia", code: "HR", isd: "+385" },
    { name: "Cuba", code: "CU", isd: "+53" },
    { name: "Cyprus", code: "CY", isd: "+357" },
    { name: "Czech Republic", code: "CZ", isd: "+420" },
    { name: "Denmark", code: "DK", isd: "+45" },
    { name: "Dominican Republic", code: "DO", isd: "+1-809" },
    { name: "Ecuador", code: "EC", isd: "+593" },
    { name: "Egypt", code: "EG", isd: "+20" },
    { name: "El Salvador", code: "SV", isd: "+503" },
    { name: "Estonia", code: "EE", isd: "+372" },
    { name: "Ethiopia", code: "ET", isd: "+251" },
    { name: "Finland", code: "FI", isd: "+358" },
    { name: "France", code: "FR", isd: "+33" },
    { name: "Georgia", code: "GE", isd: "+995" },
    { name: "Germany", code: "DE", isd: "+49" },
    { name: "Ghana", code: "GH", isd: "+233" },
    { name: "Greece", code: "GR", isd: "+30" },
    { name: "Guatemala", code: "GT", isd: "+502" },
    { name: "Honduras", code: "HN", isd: "+504" },
    { name: "Hong Kong", code: "HK", isd: "+852" },
    { name: "Hungary", code: "HU", isd: "+36" },
    { name: "Iceland", code: "IS", isd: "+354" },
    { name: "India", code: "IN", isd: "+91" },
    { name: "Indonesia", code: "ID", isd: "+62" },
    { name: "Iran", code: "IR", isd: "+98" },
    { name: "Iraq", code: "IQ", isd: "+964" },
    { name: "Ireland", code: "IE", isd: "+353" },
    { name: "Israel", code: "IL", isd: "+972" },
    { name: "Italy", code: "IT", isd: "+39" },
    { name: "Jamaica", code: "JM", isd: "+1-876" },
    { name: "Japan", code: "JP", isd: "+81" },
    { name: "Jordan", code: "JO", isd: "+962" },
    { name: "Kazakhstan", code: "KZ", isd: "+7" },
    { name: "Kenya", code: "KE", isd: "+254" },
    { name: "Kuwait", code: "KW", isd: "+965" },
    { name: "Latvia", code: "LV", isd: "+371" },
    { name: "Lebanon", code: "LB", isd: "+961" },
    { name: "Libya", code: "LY", isd: "+218" },
    { name: "Lithuania", code: "LT", isd: "+370" },
    { name: "Luxembourg", code: "LU", isd: "+352" },
    { name: "Malaysia", code: "MY", isd: "+60" },
    { name: "Maldives", code: "MV", isd: "+960" },
    { name: "Malta", code: "MT", isd: "+356" },
    { name: "Mexico", code: "MX", isd: "+52" },
    { name: "Moldova", code: "MD", isd: "+373" },
    { name: "Mongolia", code: "MN", isd: "+976" },
    { name: "Morocco", code: "MA", isd: "+212" },
    { name: "Mozambique", code: "MZ", isd: "+258" },
    { name: "Myanmar", code: "MM", isd: "+95" },
    { name: "Nepal", code: "NP", isd: "+977" },
    { name: "Netherlands", code: "NL", isd: "+31" },
    { name: "New Zealand", code: "NZ", isd: "+64" },
    { name: "Nicaragua", code: "NI", isd: "+505" },
    { name: "Nigeria", code: "NG", isd: "+234" },
    { name: "North Macedonia", code: "MK", isd: "+389" },
    { name: "Norway", code: "NO", isd: "+47" },
    { name: "Oman", code: "OM", isd: "+968" },
    { name: "Pakistan", code: "PK", isd: "+92" },
    { name: "Palestine", code: "PS", isd: "+970" },
    { name: "Panama", code: "PA", isd: "+507" },
    { name: "Paraguay", code: "PY", isd: "+595" },
    { name: "Peru", code: "PE", isd: "+51" },
    { name: "Philippines", code: "PH", isd: "+63" },
    { name: "Poland", code: "PL", isd: "+48" },
    { name: "Portugal", code: "PT", isd: "+351" },
    { name: "Qatar", code: "QA", isd: "+974" },
    { name: "Romania", code: "RO", isd: "+40" },
    { name: "Russia", code: "RU", isd: "+7" },
    { name: "Rwanda", code: "RW", isd: "+250" },
    { name: "Saudi Arabia", code: "SA", isd: "+966" },
    { name: "Senegal", code: "SN", isd: "+221" },
    { name: "Serbia", code: "RS", isd: "+381" },
    { name: "Singapore", code: "SG", isd: "+65" },
    { name: "Slovakia", code: "SK", isd: "+421" },
    { name: "Slovenia", code: "SI", isd: "+386" },
    { name: "Somalia", code: "SO", isd: "+252" },
    { name: "South Africa", code: "ZA", isd: "+27" },
    { name: "South Korea", code: "KR", isd: "+82" },
    { name: "Spain", code: "ES", isd: "+34" },
    { name: "Sri Lanka", code: "LK", isd: "+94" },
    { name: "Sudan", code: "SD", isd: "+249" },
    { name: "Sweden", code: "SE", isd: "+46" },
    { name: "Switzerland", code: "CH", isd: "+41" },
    { name: "Syria", code: "SY", isd: "+963" },
    { name: "Taiwan", code: "TW", isd: "+886" },
    { name: "Tanzania", code: "TZ", isd: "+255" },
    { name: "Thailand", code: "TH", isd: "+66" },
    { name: "Trinidad and Tobago", code: "TT", isd: "+1-868" },
    { name: "Tunisia", code: "TN", isd: "+216" },
    { name: "Turkey", code: "TR", isd: "+90" },
    { name: "Uganda", code: "UG", isd: "+256" },
    { name: "Ukraine", code: "UA", isd: "+380" },
    { name: "United Arab Emirates", code: "AE", isd: "+971" },
    { name: "United Kingdom", code: "GB", isd: "+44" },
    { name: "United States", code: "US", isd: "+1" },
    { name: "Uruguay", code: "UY", isd: "+598" },
    { name: "Uzbekistan", code: "UZ", isd: "+998" },
    { name: "Venezuela", code: "VE", isd: "+58" },
    { name: "Vietnam", code: "VN", isd: "+84" },
    { name: "Yemen", code: "YE", isd: "+967" },
    { name: "Zambia", code: "ZM", isd: "+260" },
    { name: "Zimbabwe", code: "ZW", isd: "+263" }
  ];

  // ── Populate dropdowns ──
  var countrySelect = document.getElementById('country');
  var isdSelect = document.getElementById('isdCode');

  countries.forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    countrySelect.appendChild(opt);

    var isdOpt = document.createElement('option');
    isdOpt.value = c.isd;
    isdOpt.textContent = c.isd + ' ' + c.code;
    isdSelect.appendChild(isdOpt);
  });

  // ── Auto-select ISD when country changes ──
  countrySelect.addEventListener('change', function () {
    var selected = countries.find(function (c) { return c.name === countrySelect.value; });
    if (selected) {
      isdSelect.value = selected.isd;
    }
  });

  // ── Expose submit functions globally (called via onclick) ──
  window.submitToWhatsApp = submitToWhatsApp;
  window.submitToEmail = submitToEmail;

  function getFormData() {
    return {
      businessName: document.getElementById('businessName').value.trim(),
      personalName: document.getElementById('personalName').value.trim(),
      businessEmail: document.getElementById('businessEmail').value.trim(),
      country: document.getElementById('country').value,
      isdCode: document.getElementById('isdCode').value,
      phone: document.getElementById('phone').value.trim(),
      service: document.getElementById('service').value || 'Not specified',
      message: document.getElementById('message').value.trim() || 'No additional details provided'
    };
  }

  function validateForm() {
    var data = getFormData();
    if (!data.businessName || !data.personalName || !data.businessEmail || !data.country || !data.phone) {
      alert('Please fill in all required fields (marked with *)');
      return false;
    }
    if (data.businessEmail.indexOf('@') === -1 || data.businessEmail.indexOf('.') === -1) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  }

  function submitToWhatsApp() {
    if (!validateForm()) return;
    var data = getFormData();

    var text =
      '--- NEW INQUIRY | APEX AUTOMATIONS ---\n\n' +
      'Business Name: ' + data.businessName + '\n' +
      'Contact Person: ' + data.personalName + '\n' +
      'Email: ' + data.businessEmail + '\n' +
      'Country: ' + data.country + '\n' +
      'Phone: ' + data.isdCode + ' ' + data.phone + '\n' +
      'Service Interested: ' + data.service + '\n' +
      'Message: ' + data.message + '\n\n' +
      '---';

    window.open('https://wa.me/917087642005?text=' + encodeURIComponent(text), '_blank');
  }

  function submitToEmail() {
    if (!validateForm()) return;
    var data = getFormData();

    var subject = encodeURIComponent('New Inquiry from ' + data.businessName + ' | Apex Automations');

    var body =
      '--- NEW INQUIRY | APEX AUTOMATIONS ---\n\n' +
      'Business Name: ' + data.businessName + '\n' +
      'Contact Person: ' + data.personalName + '\n' +
      'Email: ' + data.businessEmail + '\n' +
      'Country: ' + data.country + '\n' +
      'Phone: ' + data.isdCode + ' ' + data.phone + '\n' +
      'Service Interested: ' + data.service + '\n' +
      'Message: ' + data.message + '\n\n' +
      '---';

    window.location.href = 'mailto:homechoudhuryapex@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(body);
  }

});
