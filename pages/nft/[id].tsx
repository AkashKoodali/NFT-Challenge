import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";

interface Props {
  collection: Collection
}

const NFTDropPage = ({collection}: Props) => {
  //Auth
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  //--

  return (
    
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      
      {/* left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              src={urlFor(collection.previewImage).url()}
              alt=""
              className="w-44 object-cover rounded-xl lg:h-96 lg:w-72"
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
            <h2 className="text-xl text-gray-300">
            {collection.description}
            </h2>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="flex flex-1 flex-col lg:col-span-6 p-12">
        <header className="flex items-center justify-between ">
          <Link href={'/'}>
            <h1 className="sm:w-80 w-52 cursor-pointer text-xl font-extralight">
              The{" "}
              <span className="font-extrabold underline decoration-pink-600/50">
                BEARVERSE
              </span>{" "}
              NFT Market Place
            </h1>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? "Singn Out" : "Singn In"}
          </button>
        </header>
        <hr className="my-2 border" />


        {address && <p className="text-center text-sm text-rose-400">You're logged in with wallet 
        {address?.substring(0, 5)}.....{address?.substring(address.length - 5)}</p>}

        {/* content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center">
          <img
            className="w-80 object-cover pb-10 lg:h-40 "
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
          {collection?.title}
          </h1>
          <p className="p-2 text-xl text-green-500">13 / 21 NFT's claimed</p>
        </div>

        {/* mint button */}
        <button className="h-16 w-full bg-red-600 rounded-full text-white mt-10 font-bold">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;


export const getServerSideProps: GetServerSideProps = async ({params}) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    description,
    nftCollectionName,
    mainImage{
    asset,
  },
  previewImage{
    asset
  },
  slug{
    current
  },
  creator-> {
    _id,
    name,
    address,
    slug {
    current
  },
  },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id
  });

  if(!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection
    }
  }

}
