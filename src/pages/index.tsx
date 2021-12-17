import { FiUser, FiArchive } from 'react-icons/fi';
import { GetStaticProps } from 'next';
import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';
import { formatDatePtBR } from '../helpers/datePtBR';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  next_page,
  results,
}: PostPagination): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState(next_page);

  function loadMorePosts(): void {
    fetch(next_page)
      .then(response => response.json())
      .then((data: PostPagination) => {
        setPosts([...posts, ...data.results]);
        setNextPage(data.next_page);
      });
  }

  return (
    <>
      <Header />
      <div className={commonStyles.container}>
        <div className={styles.HomeContent}>
          {posts.map(post => (
            <a key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <span>
                <FiUser />
                {formatDatePtBR(new Date(post.first_publication_date))}
                <FiArchive /> {post.data.author}
              </span>
            </a>
          ))}
        </div>

        {nextPage && (
          <div className={styles.HomeFooter}>
            <button type="button" onClick={loadMorePosts}>
              Carregar mais posts
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', {
    pageSize: 1,
  });

  return {
    props: {
      results: postsResponse.results,
      next_page: postsResponse.next_page,
    },
  };
};
