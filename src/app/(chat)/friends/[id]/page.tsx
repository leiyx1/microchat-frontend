"use client"
import {useParams} from "next/navigation";

export default function Page() {
  const params = useParams();
  const { id } = params

  return (
    <>
        {id}
    </>
  );
}
