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
    !currentUser && { label: "đ Log In", href: "/auth/login" },
    currentUser && { label: "â¨ Offers", href: "/offers" },
    currentUser && { label: "đ¯ RFQs", href: "/rfqs" },
    currentUser && { label: "đģ Projects", href: "/projects" },
    currentUser && { label: "đ Partnumbers", href: "/partnumbers" },
    currentUser && { label: "đ Clients", href: "/clients" },
    currentUser && { label: "đ­ Industries", href: "/industries" },
    currentUser && isAdmin && { label: "đ¤ Users", href: "/users" },
    currentUser && { label: "đšī¸  Config", href: "/config" },
    currentUser && { label: "đ Log Out", href: "/auth/logout" },
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
    <div className="tabs is-right is-boxed mb-3 px-3 pt-3 sticky-navbar">
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
