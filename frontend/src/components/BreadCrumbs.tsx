import { Link } from "react-router-dom";

interface BreadcrumbLink {
  label: string;
  to?: string;
}

const Breadcrumbs = ({ links }: { links: BreadcrumbLink[] }) => {
  return (
    <nav className="text-sm font-medium">
      <ol className="list-none p-0 flex">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-3 h-3 mx-1 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            {link.to ? (
              <Link to={link.to} className="text-blue-500 hover:text-blue-700">
                {link.label}
              </Link>
            ) : (
              <span className="text-gray-500">{link.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
