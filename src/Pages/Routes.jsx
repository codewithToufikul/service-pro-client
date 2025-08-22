import { createBrowserRouter } from "react-router-dom";
import Home from "./Home/Home";
import About from "./About/About";
import Servies from "./Servies/Servies";
import Projects from "./Projects/Projects";
import Contract from "./Contract/Contract";
import Admin from "./Admin/Admin";
import Dashboard from "./Dashboard/Dashboard";
import ManageServieses from "./DashboardPages/ManageServieses";
import DashHome from "./DashboardPages/DashHome";
import ManageLatestWork from "./DashboardPages/ManageLatestWork";
import ManageFaq from "./DashboardPages/ManageFaq";
import ManageWorkStatus from "./DashboardPages/ManageWorkStatus";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Login from "./Login/Login";
import Registation from "./Registation/Registation";
import ServiceDetails from "./ServiceDetails/ServiceDetails";
import ServicePayment from "./ServicePayment/ServicePayment";
import PrivateRoute from "../AuthProvider/PrivetRoute";
import GiveFeedback from './GiveFeedback/GiveFeedback';
import PaymentHistory from "./PaymentHistory/PaymentHistory";
import TermsAndCondition from "./TermsAndCondition/TermsAndCondition";
import UserProfile from "./UserProfile/UserProfile";
import ChangePass from "./ChangePass/ChangePass";
import AdminRoute from "../AuthProvider/AdminRoute";
import ChatBox from "./ChatBox/ChatBox";
import ClientMessage from "./DashboardPages/ClientMessage";
import EmailVerify from "./EmailVerify/EmailVerify";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import ManageUser from "./DashboardPages/ManageUser";
import ManageBlogs from "./DashboardPages/ManageBlogs";
import Blogs from "./Blogs/Blogs";
import BlogDetails from "./BlogDetails/BlogDetails";
import ManageFeedback from "./DashboardPages/ManageFeedback";
import ManageOrder from "./DashboardPages/ManageOrder";
import RefundPolicy from "./RefundPolicy/RefundPolicy";
import PaymentSuccess from "./PaymentResult/Success";
import PaymentFail from "./PaymentResult/Fail";
import PaymentCancel from "./PaymentResult/Cancel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About></About>,
  },
  {
    path: "/services",
    element: <Servies />,
  },
  {
    path: "/project",
    element: <Projects />,
  },
  {
    path: "/contract",
    element: <Contract />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-condition",
    element : <TermsAndCondition/>
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><AdminRoute><Admin /></AdminRoute></PrivateRoute>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Registation />,
  },
  {
    path: "/service/:id",
    element: <ServiceDetails />,
  },
  {
    path: "/service-book/:serviceId",
    element: <PrivateRoute><ServicePayment /></PrivateRoute>,
  },
  {
    path: "/give-feedback",
    element: <PrivateRoute><GiveFeedback /></PrivateRoute>,
  },
  {
    path: "/payment-history",
    element: <PrivateRoute><PaymentHistory /></PrivateRoute>,
  },
  {
    path: "/user-profile",
    element: <PrivateRoute><UserProfile/></PrivateRoute>
  },
  {
    path: "/change-password",
    element: <PrivateRoute><ChangePass/></PrivateRoute>
  },
  {
    path: "/chat/:userId/:serviceId",
    element: <PrivateRoute><ChatBox/></PrivateRoute>
  },{
    path:"/verify-email",
    element: <EmailVerify/>
  },
  {
    path: "/reset-your-password",
    element: <ForgotPassword/>
  },{
    path: '/reset-password',
    element: <ResetPassword/>
  },
  {
    path: "/blogs",
    element: <Blogs/>
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess/>
  },
  {
    path: "/payment/fail",
    element: <PaymentFail/>
  },
  {
    path: "/payment/cancel",
    element: <PaymentCancel/>
  },
  {
    path: "/blog-details/:blogId",
    element: <BlogDetails/>
  },
  {
    path: "/refund-policy",
    element: <RefundPolicy/>
  },
  {
    path: "/admin-dashboard",
    element: <PrivateRoute><AdminRoute><Dashboard /></AdminRoute></PrivateRoute>,
    children: [
      {
        path: "/admin-dashboard",
        element: <PrivateRoute><AdminRoute><ManageServieses /></AdminRoute></PrivateRoute>,
      },
      {
        path: "/admin-dashboard/manage-work",
        element: <PrivateRoute><AdminRoute><ManageLatestWork /></AdminRoute></PrivateRoute>,
      },
      {
        path: "/admin-dashboard/manage-faq",
        element: <PrivateRoute><AdminRoute><ManageFaq /></AdminRoute></PrivateRoute>,
      },
      {
        path: "/admin-dashboard/manage-status",
        element: <PrivateRoute><AdminRoute><ManageWorkStatus /></AdminRoute></PrivateRoute>,
      },
      {
        path: "/admin-dashboard/client-messages",
        element: <PrivateRoute><AdminRoute><ClientMessage/></AdminRoute></PrivateRoute>
      },
      {
        path: "/admin-dashboard/manage-users",
        element: <PrivateRoute><AdminRoute><ManageUser/></AdminRoute></PrivateRoute>
      },
      {
        path: "/admin-dashboard/manage-blogs",
        element: <PrivateRoute><AdminRoute><ManageBlogs/></AdminRoute></PrivateRoute>
      },
      {
        path: "/admin-dashboard/manage-feedback",
        element: <PrivateRoute><AdminRoute><ManageFeedback/></AdminRoute></PrivateRoute>
      },
      {
        path: "/admin-dashboard/manage-order",
        element: <PrivateRoute><AdminRoute><ManageOrder/></AdminRoute></PrivateRoute>
      }
    ],
  },
]);
