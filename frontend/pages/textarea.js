import Head from 'next/head';
import styles from '../styles/Home.module.css';
import QuillArea from './components/quill/quill_area';

export default function TextArea() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>Upword.ly Textarea Demo</h1>
          <QuillArea />
        </div>
      </main>
    </div>
  );
}
