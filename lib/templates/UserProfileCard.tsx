import React from 'react';

function Component({ mockData = {} }: { mockData?: any }) {
  const {
    name = "Sarah Johnson",
    role = "Senior Product Designer",
    company = "TechCorp Inc.",
    avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    coverImage = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=300&fit=crop",
    bio = "Passionate about creating intuitive and delightful user experiences. 10+ years in design.",
    location = "San Francisco, CA",
    website = "sarahjohnson.design",
    followers = 2847,
    following: followingCount = 342,
    posts = 127,
    isFollowing = false,
    badges = ["Verified", "Pro Member"],
    stats = [
      { label: "Projects", value: 42 },
      { label: "Reviews", value: 156 },
      { label: "Rating", value: "4.9" },
    ],
  } = mockData;

  const [following, setFollowing] = React.useState(isFollowing);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-75"
            />
          </div>

          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20">
                <div className="relative">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  {/* Online Status */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                </div>

                {/* Name and Role */}
                <div className="mt-4 sm:mt-0 sm:ml-6 sm:mb-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {name}
                    </h1>
                    {/* Badges */}
                    {badges.map((badge: any, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {badge === "Verified" && (
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mt-1">{role}</p>
                  <p className="text-gray-500 text-sm">{company}</p>
                </div>
              </div>

              {/* Follow Button */}
              <div className="mt-4 sm:mt-0 flex gap-2">
                <button
                  onClick={() => setFollowing(!following)}
                  className={`
                    flex-1 sm:flex-none px-6 py-2 rounded-lg font-medium transition-colors
                    ${
                      following
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                >
                  {following ? "Following" : "Follow"}
                </button>
                <button className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <p className="text-gray-700">{bio}</p>
            </div>

            {/* Info Pills */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <a href={`https://${website}`} className="text-blue-600 hover:underline">
                  {website}
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {followingCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {posts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat: any, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center"
                >
                  <div className="text-3xl font-bold text-blue-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Action Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                {["Posts", "About", "Photos", "Videos"].map((tab, index) => (
                  <button
                    key={tab}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        index === 0
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Component;
