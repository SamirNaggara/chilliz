import { Coins, Star, Crown } from "lucide-react";

export function ShopAdvantages() {
  return (
    <div className="mt-16 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">
          Become a PSG Leader: Scannable Benefits
        </h3>
        <p className="text-blue-700 font-semibold">
          Buy a scannable product, become a PSG Leader and unlock a world of
          exclusive benefits!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-lg mb-2 text-blue-800">
            Exclusive Contests
          </h4>
          <p className="text-gray-700 text-sm">
            Get access to PSG-only contests with{" "}
            <span className="font-bold text-red-600">amazing prizes</span> to
            win: signed jerseys, VIP tickets, unique experiences...
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-lg mb-2 text-blue-800">
            Share the Experience
          </h4>
          <p className="text-gray-700 text-sm">
            Your scannable product lets you invite friends and family to
            contests, and makes you the star of every PSG event!
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-lg mb-2 text-blue-800">
            Rewards & Chilliz
          </h4>
          <p className="text-gray-700 text-sm">
            Earn Chilliz tokens in every contest, enjoy exclusive discounts, and
            discover all the benefits of the Chilliz universe!
          </p>
        </div>
      </div>
    </div>
  );
}
