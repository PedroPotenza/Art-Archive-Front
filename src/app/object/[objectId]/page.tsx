"use client";
import { useEffect, useState } from "react";
import axiosInstance from "../../../libs/axios/axios";
import { Record } from "../../util/models/models";
import SkeletonLoader from "../../../components/skeletonLoader";
import React from "react";
import { themeTailwindColorsToHex } from "../../util/converters";

export default function Object({ params }: { params: { objectId: string } }) {
  const [object, setObject] = useState<Record>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getObjectDetails = async (): Promise<Record | null> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`proxy/object?id=${params.objectId}`);
      return response.data.records[0];
    } catch (error) {
      console.error("Failed to fetch object details:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getObjectDetails().then((data) => {
      if (data) setObject(data);
    });
  }, []);

  return (
    <div className="flex w-full h-full overflow-y-hidden">
      {isLoading ? (
        <div className="bg-silver-gray text-almost-white w-4/12 2xl:w-3/12 h-full p-6 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : object ? (
        <div className="bg-silver-gray w-4/12 2xl:w-3/12 h-full p-6 text-almost-white">
          <div className="flex flex-col border-l-4 pl-4 border-golden-yellow">
            <p className="text-md">ID {object.id}</p>
            <p className="text-2xl font-semibold">{object.title}</p>
            <SkeletonLoader
              cssClass="w-10"
              baseColor="bg-silver-gray-dark"
              shimmerColor={themeTailwindColorsToHex["silver-gray-lighter"]}
              type="rectangle"
            />
          </div>
        </div>
      ) : (
        <div className="bg-silver-gray w-4/12 2xl:w-3/12 h-full p-6 flex items-center justify-center">
          <p>No object found</p>
        </div>
      )}

      <div className="w-full h-full overflow-y-auto flex flex-col gap-10 p-8">
        <p> content section</p>
        <p> content 2</p>
      </div>
    </div>
  );
}

Object.requireAuth = false;
