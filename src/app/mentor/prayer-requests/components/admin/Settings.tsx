import React from "react";
import Button from "../Button";
import InputField from "../InputField";

export default function Settings() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Prayer Settings
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto-fulfill Days
          </label>
          <input
            type="number"
            defaultValue="30"
            className="w-24 px-3 py-2 text-gray-500 border border-gray-300 rounded-lg focus:outline-0 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Days after which pending requests are auto-marked as fulfilled
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Settings
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
           
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Email notifications for new requests
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Push notifications for high priority
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Weekly summary emails
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Academic",
              "Mentorship",
              "Career",
              "Relationship",
              "Wisdom",
              "Health",
              "Family",
              "Spiritual Growth",
            ].map((category) => (
              <span
                key={category}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type='button' className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
