'use client';

import { motion } from 'framer-motion';

// Group members data
const members = [
  { name: 'Allan Alvine', id: 'SCT212-0080/2021' },
  { name: 'Kennedy Wanakacha', id: 'SCT212-0074/2021' },
  { name: 'Princeton Mwachala', id: 'SCT212-0657/2021' },
  { name: 'Diana Wanjiru', id: 'SCT212-0119/2022' },
  { name: 'Kositany Kimetto', id: 'SCT212-0722/2022' },
];

export default function GroupMembersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-8 md:p-10 lg:p-12">
            <div className="text-center mb-10 md:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                Group Members
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Meet the talented team behind ModularVerse CMS prototype.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {member.id}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}