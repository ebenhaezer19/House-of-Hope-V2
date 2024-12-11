import{u as h,a as b,r as n,j as e,L as p}from"./index-xC-13q4f.js";const j=()=>{const c=h(),{login:m}=b(),[t,r]=n.useState(!1),[i,a]=n.useState(""),x=async l=>{var o,d;l.preventDefault(),r(!0),a("");try{const s=new FormData(l.target),u=s.get("email"),g=s.get("password");await m(u,g),c("/dashboard")}catch(s){console.error("Login error:",s),s.code==="ERR_NETWORK"?a("Tidak dapat terhubung ke server. Mohon cek koneksi Anda."):a(((d=(o=s.response)==null?void 0:o.data)==null?void 0:d.message)||"Gagal login. Silakan coba lagi.")}finally{r(!1)}};return e.jsxs("div",{className:"min-h-screen flex items-center justify-center relative",children:[e.jsx("div",{className:"absolute inset-0 z-0",style:{backgroundImage:'url("/loginformbackground.jpg")',backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat"},children:e.jsx("div",{className:"absolute inset-0 bg-black/50"})}),e.jsx("div",{className:"w-full max-w-md z-10",children:e.jsxs("div",{className:"bg-white/90 backdrop-blur-sm px-8 py-10 rounded-lg shadow-xl",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"flex justify-center items-center",children:e.jsx("img",{className:"h-12 w-auto ml-8",src:"/ADMINCARE.svg",alt:"AdminCare"})}),e.jsx("h2",{className:"mt-6 text-3xl font-bold tracking-tight text-gray-900",children:"House of Hope"}),e.jsx("p",{className:"mt-2 text-sm text-gray-600",children:"Masuk ke dashboard admin"})]}),i&&e.jsx("div",{className:"mb-4 bg-red-50 border-l-4 border-red-400 p-4",children:e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("svg",{className:"h-5 w-5 text-red-400",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})})}),e.jsx("div",{className:"ml-3",children:e.jsx("p",{className:"text-sm text-red-700",children:i})})]})}),e.jsxs("form",{className:"space-y-6",onSubmit:x,children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-gray-700",children:"Email"}),e.jsx("input",{id:"email",name:"email",type:"email",autoComplete:"email",required:!0,className:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-gray-700",children:"Password"}),e.jsx("input",{id:"password",name:"password",type:"password",autoComplete:"current-password",required:!0,className:"mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{id:"remember-me",name:"remember-me",type:"checkbox",className:"h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"}),e.jsx("label",{htmlFor:"remember-me",className:"ml-2 block text-sm text-gray-900",children:"Ingat saya"})]}),e.jsx("div",{className:"text-sm",children:e.jsx(p,{to:"/forgot-password",className:"font-medium text-indigo-600 hover:text-indigo-500",children:"Lupa password?"})})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",disabled:t,className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50",children:t?"Mohon tunggu...":"Masuk"})})]}),e.jsxs("div",{className:"mt-6 text-center",children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Test credentials:"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Email: admin@example.com"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Password: admin123"})]})]})})]})};export{j as default};
