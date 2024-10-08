import Image from "next/image";
import Link from "next/link";
import { getVideos } from "../utilities/firebase/functions";
import styles from "./page.module.css"


export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {
        videos.map((video) => (
          <Link key={video.id} href={`/watch?v=${video.filename}`}>
            <Image src={"/washubear.svg"} alt="video" width={120} height={80}
              className={styles.thumbnail}/>
          </Link>
        ))
      }
    </main>
  )
}

export const revalidate = 30;
