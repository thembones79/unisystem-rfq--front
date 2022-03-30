import Link from "next/link";
import { useRouter } from "next/router";
import { IUser } from "../pages/users";
import styles from "../styles/Header.module.scss";

interface HeaderProps {
  currentUser: IUser | null;
}

export const Header = ({ currentUser }: HeaderProps) => {
  const router = useRouter();

  const isAdmin = currentUser?.role_id === 1;

  const links = [
    !currentUser && { label: "🔐 Log In", href: "/auth/login" },
    // currentUser && { label: "🎯 New RFQ", href: "/rfqs/new" },
    currentUser && { label: "📋 RFQs", href: "/rfqs" },
    currentUser && { label: "🍻 Projects", href: "/projects" },
    currentUser && { label: "😘 Clients", href: "/clients" },
    currentUser && { label: "🏭 Industries", href: "/industries" },
    //  currentUser && { label: "🚀 Distributors", href: "/distributors" },
    currentUser && isAdmin && { label: "👤 Users", href: "/users" },
    currentUser && { label: "💔 Log Out", href: "/auth/logout" },
  ]
    .filter((truthyLink) => truthyLink)

    .map(({ label, href }: any) => {
      return (
        <li key={href} className={router.pathname === href ? "is-active" : ""}>
          <Link href={href}>{label}</Link>
        </li>
      );
    });

  return (
    <div className="tabs is-right is-boxed  m-3 sticky-navbar">
      <ul>
        <li className={styles.logo}>
          <div className={styles.logo__item}>
            <Link href="/">
              <span>
                <span className="mx-1"></span>
                <span className={`icon ${styles.spinning}`}>
                  <i className="fas fa-pizza-slice"></i>
                </span>
                <span className="mx-1"></span>
                <span>Unisystem RFQ</span>
              </span>
            </Link>
          </div>
        </li>
        {links}
      </ul>
    </div>
  );
};
