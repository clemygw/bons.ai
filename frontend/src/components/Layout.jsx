import DevSidebar from "./DevSidebar"
import TopBar from "./TopBar"
import { useCompany } from "../context/CompanyContext"

const Layout = ({ children }) => {
  const { company } = useCompany()

  return (
    <div className="flex">
      <DevSidebar />
      <div className="flex-1 ml-16"> {/* Sidebar width */}
        <TopBar companyName={company?.name} />
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout 