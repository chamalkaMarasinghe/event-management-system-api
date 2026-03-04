// function deepLinkRedirect({ 
//   status, 
//   eventId, 
//   amount, 
//   paymentIntentId, 
//   paymentMethod,
//   schedulingType,
//   bookingId 
// }) {
//   const params = new URLSearchParams({
//     status,
//     event: eventId || '',
//     amount: amount || '',
//     paymentIntentId: paymentIntentId || '',
//     paymentMethod: paymentMethod || '',
//     schedulingType: schedulingType || '',
//     bookingId: bookingId || ''
//   }).toString();

//   const customSchemeBase = process.env.DEEP_LINK_SCHEME || 'kidsplan://';
//   const universalLinkBase = process.env.UNIVERSAL_LINK || 'https://kids-plan.icieos.org';

//   const customScheme = `${customSchemeBase}payment?${params}`;
//   const universalLink = `${universalLinkBase}/payment?${params}`;

//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Payment ${status === 'success' ? 'Successful' : 'Failed'}</title>
//         <style>
//           body {
//             font-family: -apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             min-height: 100vh;
//             margin: 0;
//             background: linear-gradient(135deg, #efefeaff 0%, rgba(249, 219, 195, 1) 100%);
//             color: rgb(245, 104, 34);
//             text-align: center;
//           }
//           .container {
//             padding: 2rem;
//             border-radius: 10px;
//             background: rgba(255, 255, 255, 0.4);
//             backdrop-filter: blur(10px);
//             border-bottom: 4px solid rgb(244, 126, 83);
//           }
//           .spinner {
//             width: 40px;
//             height: 40px;
//             border: 4px solid rgba(255, 255, 255, 0.7);
//             border-top: 4px solid rgb(227, 75, 20);
//             border-radius: 50%;
//             animation: spin 1s linear infinite;
//             margin: 0 auto 1rem;
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//           .fallback-link {
//             display: inline-block;
//             margin-top: 1rem;
//             padding: 0.5rem 1rem;
//             background: rgba(255, 255, 255, 0.2);
//             border-radius: 5px;
//             color: white;
//             text-decoration: none;
//             border: 1px solid rgba(255, 255, 255, 0.3);
//           }
//           .fallback-link:hover {
//             background: rgba(255, 255, 255, 0.3);
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="spinner"></div>
//           <h2>Payment ${status === 'success' ? 'Successful!' : 'Failed'}</h2>
//           <p>Redirecting to Kids Plan app...</p>
//           <a href="${universalLink}" class="fallback-link" id="fallback-link" style="display: none;">
//             Open in App
//           </a>
//         </div>

//         <script>
//           (function() {
//             var schemeUrl = "${customScheme}";
//             var universalLink = "${universalLink}";
//             var fallbackLink = document.getElementById('fallback-link');
            
//             console.log('Attempting custom scheme:', schemeUrl);
//             console.log('Fallback universal link:', universalLink);
            
//             // Try custom scheme first
//             var iframe = document.createElement('iframe');
//             iframe.style.display = 'none';
//             iframe.src = schemeUrl;
//             document.body.appendChild(iframe);
            
//             // Fallback to universal link after 1.5 seconds
//             var fallbackTimer = setTimeout(function() {
//               console.log('Custom scheme timeout, trying universal link');
//               window.location.href = universalLink;
//             }, 1500);
            
//             // Show manual fallback link after 3 seconds
//             setTimeout(function() {
//               fallbackLink.style.display = 'inline-block';
//             }, 3000);
            
//             // Clear timeout if page is about to unload (app opened)
//             window.addEventListener('beforeunload', function() {
//               clearTimeout(fallbackTimer);
//             });
            
//             // Detect if app opened (page becomes hidden)
//             document.addEventListener('visibilitychange', function() {
//               if (document.hidden) {
//                 clearTimeout(fallbackTimer);
//               }
//             });
//           })();
//         </script>
//       </body>
//     </html>
//   `;
// }

function deepLinkRedirect({ 
  status, 
  eventId, 
  amount, 
  paymentIntentId, 
  paymentMethod,
  schedulingType,
  bookingId 
}) {
  const params = new URLSearchParams({
    status,
    event: eventId || '',
    amount: amount || '',
    paymentIntentId: paymentIntentId || '',
    paymentMethod: paymentMethod || '',
    schedulingType: schedulingType || '',
    bookingId: bookingId || ''
  }).toString();

  const customSchemeBase = process.env.DEEP_LINK_SCHEME || 'kidsplan://';
  const customScheme = `${customSchemeBase}payment?${params}`;

  // console.log('called deeplink redirect', customSchemeBase, customScheme);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment ${status === 'success' ? 'Successful' : 'Failed'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: white;
            color: rgb(245, 104, 34);
            text-align: center;
          }
          .container {
            padding: 2rem;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(10px);
            border-bottom: 4px solid rgb(244, 126, 83);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.7);
            border-top: 4px solid rgb(227, 75, 20);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .fallback-link {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            color: rgb(245, 104, 34);
            text-decoration: none;
            border: 1px solid rgba(255, 255, 255, 0.3);
            font-weight: 500;
          }
          .fallback-link:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h2>Payment ${status === 'success' ? 'Successful!' : 'Failed'}</h2>
          <p>Redirecting to kidsplan app...</p>
          <a href="${customScheme}" class="fallback-link" id="fallback-link" style="display: none;">
            Open kidsplan App
          </a>
        </div>

        <script>
          (function() {
            var schemeUrl = "${customScheme}";
            var fallbackLink = document.getElementById('fallback-link');
            var appOpened = false;
            
            console.log('Attempting to open app with:', schemeUrl);
            
            // Method 1: Direct location change (most reliable)
            function tryOpenApp() {
              try {
                window.location.href = schemeUrl;
              } catch (e) {
                console.error('Error opening app:', e);
              }
            }
            
            // Try immediately
            tryOpenApp();
            
            // Method 2: Hidden iframe (backup for some browsers)
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = schemeUrl;
            document.body.appendChild(iframe);
            
            // Method 3: Anchor click (works on some mobile browsers)
            setTimeout(function() {
              var link = document.createElement('a');
              link.href = schemeUrl;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, 500);
            
            // Show manual fallback button after 2.5 seconds
            setTimeout(function() {
              if (!appOpened) {
                fallbackLink.style.display = 'inline-block';
                console.log('Showing manual fallback button');
              }
            }, 2500);
            
            // Detect if app opened successfully
            document.addEventListener('visibilitychange', function() {
              if (document.hidden) {
                appOpened = true;
                console.log('App opened - page hidden');
              }
            });
            
            // Detect page blur (app opened)
            window.addEventListener('blur', function() {
              appOpened = true;
              console.log('App opened - page blurred');
            });
            
            // iOS specific: pagehide event
            window.addEventListener('pagehide', function() {
              appOpened = true;
              console.log('App opened - page hide event');
            });
          })();
        </script>
      </body>
    </html>
  `;
}

module.exports = { deepLinkRedirect };