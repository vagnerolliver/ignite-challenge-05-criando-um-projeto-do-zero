import Image from 'next/image';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src="/images/Logo.svg"
          alt="Título do Blog"
          width="239"
          height="27"
        />
      </div>
    </div>
  );
}
