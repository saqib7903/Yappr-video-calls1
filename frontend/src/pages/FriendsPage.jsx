import { useQuery } from "@tanstack/react-query";
import { getUserFriends, getRecommendedUsers, sendFriendRequest } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getOutgoingFriendReqs } from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  MessageSquareIcon,
  SearchIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("friends"); // "friends" | "discover"
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  const filteredFriends = friends.filter((f) =>
    f.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = recommendedUsers.filter((u) =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Friends</h1>
            <p className="text-base-content opacity-60 mt-1">
              Manage your connections and discover new language partners
            </p>
          </div>
          <Link to="/notifications" className="btn btn-outline btn-sm gap-2">
            <UsersIcon className="size-4" />
            Friend Requests
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content opacity-50" />
          <input
            type="text"
            placeholder="Search by name..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed w-fit">
          <button
            className={`tab gap-2 ${activeTab === "friends" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("friends")}
          >
            <UsersIcon className="size-4" />
            My Friends
            {friends.length > 0 && (
              <span className="badge badge-sm">{friends.length}</span>
            )}
          </button>
          <button
            className={`tab gap-2 ${activeTab === "discover" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            <UserPlusIcon className="size-4" />
            Discover
            {recommendedUsers.length > 0 && (
              <span className="badge badge-sm">{recommendedUsers.length}</span>
            )}
          </button>
        </div>

        {/* MY FRIENDS TAB */}
        {activeTab === "friends" && (
          <>
            {loadingFriends ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : filteredFriends.length === 0 ? (
              searchTerm ? (
                <div className="card bg-base-200 p-6 text-center">
                  <p className="opacity-70">No friends match "{searchTerm}"</p>
                </div>
              ) : (
                <NoFriendsFound />
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-4 space-y-3">
                      {/* Avatar + Name */}
                      <div className="flex items-center gap-3">
                        <div className="avatar size-12 rounded-full">
                          <img src={friend.profilePic} alt={friend.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold truncate">{friend.fullName}</h3>
                          <span className="text-xs text-success flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-success inline-block" />
                            Online
                          </span>
                        </div>
                      </div>

                      {/* Language Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary text-xs">
                          {getLanguageFlag(friend.nativeLanguage)}
                          Native: {capitialize(friend.nativeLanguage || "")}
                        </span>
                        <span className="badge badge-outline text-xs">
                          {getLanguageFlag(friend.learningLanguage)}
                          Learning: {capitialize(friend.learningLanguage || "")}
                        </span>
                      </div>

                      {/* Message Button */}
                      <Link
                        to={`/chat/${friend._id}`}
                        className="btn btn-primary btn-sm w-full gap-2"
                      >
                        <MessageSquareIcon className="size-4" />
                        Message
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* DISCOVER TAB */}
        {activeTab === "discover" && (
          <>
            {loadingUsers ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  {searchTerm ? `No users match "${searchTerm}"` : "No recommendations available"}
                </h3>
                <p className="text-base-content opacity-70">
                  {searchTerm ? "Try a different name." : "Check back later for new language partners!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p-5 space-y-4">
                        {/* Avatar + Name + Location */}
                        <div className="flex items-center gap-3">
                          <div className="avatar size-16 rounded-full">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{user.fullName}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Language Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitialize(user.nativeLanguage || "")}
                          </span>
                          <span className="badge badge-outline">
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitialize(user.learningLanguage || "")}
                          </span>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                          <p className="text-sm opacity-70 line-clamp-2">{user.bio}</p>
                        )}

                        {/* Action Button */}
                        <button
                          className={`btn w-full ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;